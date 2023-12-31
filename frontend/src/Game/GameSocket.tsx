import React, { useState, useEffect, useRef } from "react";
import { gsocket } from "../context/websocket.context";
import Cookies from "js-cookie";
import decodeToken from "../helpers/helpers";
import cowLogo from "../cow.png";
import collectable from "../collectable.png";
import supervan from "../supervan.png";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUserStatus } from "../Redux-helpers/action";

export interface GameData {
  NameOfRoom: string;
  player1: Players;
  player2: Players;
  score1: number;
  score2: number;
  ball: Ball;
  bonus: Ball;
  started: boolean;
  converted: boolean;
  bonusconverted: boolean;
  paused: number;
  color: string;
  gameID: number;
  bonusActive: boolean;
  gameType: number;
  legacy: number;
  spectator: number;
}

interface Players {
  pNumber: number;
  id: number;
  name: string;
  avatar: string;
  pos_y: number;
  pos_x: number;
  speed: number;
}

interface Ball {
  pos_y: number;
  pos_x: number;
  speed_y: number;
  speed_x: number;
}

function usePageVisibility() {
  const [isVisible, setIsVisible] = useState(!document.hidden);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    window.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);
  return isVisible;
}

const GameSocket: React.FC = () => {
  const dispatch = useDispatch();
  const [canvas, setCanvas] = useState(true);
  const [shouldRun, setShouldRun] = useState(true);
  const bodyNavigate = useNavigate();
  const token: string | undefined = Cookies.get("token");
  let content: { username: string; user: number; avatar: string };
  const [player1, setPlayer1] = useState<string>("player1");
  const [player2, setPlayer2] = useState<string>("player2");
  const [score1disp, setScore1] = useState<number>(0);
  const [score2disp, setScore2] = useState<number>(0);
  let paddleSize: number = 100;
  let cowLogoImage: HTMLImageElement = new Image();
  let collectableImage: HTMLImageElement = new Image();
  let supervanImage: HTMLImageElement = new Image();
  const canvasRef = useRef<HTMLCanvasElement>();
  const isVisible = usePageVisibility();
  const intervalId = useRef<number | undefined>();
  if (token !== undefined) content = decodeToken(token);

  let data = useRef<GameData>({
    NameOfRoom: "",
    player1: {
      pNumber: 0,
      id: 0,
      name: "",
      avatar: "",
      pos_y: 10,
      pos_x: 0,
      speed: 25,
    },
    player2: {
      pNumber: 0,
      id: 0,
      name: "",
      avatar: "",
      pos_y: 0,
      pos_x: 10,
      speed: 25,
    },
    score1: 0,
    score2: 0,
    ball: {
      pos_y: 100,
      pos_x: 100,
      speed_y: 2,
      speed_x: 4,
    },
    bonus: {
      pos_x: 100,
      pos_y: 100,
      speed_y: 1,
      speed_x: 2,
    },
    spectator: 0,
    started: false,
    converted: false,
    bonusconverted: false,
    paused: 0,
    color: "pink",
    gameID: 0,
    bonusActive: false,
    gameType: 0,
    legacy: 1,
  });

  // const userStatus = useSelector((state: any) => state.userStatus);

  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

  useEffect(() => {
    const canvas = canvasRef.current!;
    if (!canvas) {
      setShouldRun(false);
    }
  }, [canvas]);

  useEffect(() => {
	console.log("Before should run")
    // once at the start of the component
    if (shouldRun) {
		console.log("Inside should run")
		intervalId.current = window.setInterval(updateGame, 1000 / 30, data);
	}
    window.addEventListener("keydown", (e: KeyboardEvent) => handleKeyPress(e));
    cowLogoImage.src = cowLogo;
    supervanImage.src = supervan;
    collectableImage.src = collectable;
    if (token !== undefined) {
      let content = decodeToken(token);
      data.current.player1.id = content?.user;
      data.current.player1.name = content?.username;
      data.current.player1.avatar = content?.avatar;
    } else {
      data.current.player1.id = 0;
      data.current.player1.name = "default";
      data.current.player1.avatar = `${process.env.REACT_APP_HOST}images/default.png`;
    }
    let intervalBonus = window.setInterval(() => {
      let rand = randomNumberInRange(1, 100);
      if (
        data.current.gameType === 1 &&
        data.current.player1.pNumber === 1 &&
        data.current.bonusActive === false
      ) {
        if (rand >= 50) {
          gsocket.emit("bonus-pos", {
            roomName: data.current.NameOfRoom,
            pos_x: randomNumberInRange(50, 100),
            pos_y: randomNumberInRange(50, 100),
            playerNumber: data.current.player1.pNumber,
            speed_x: randomNumberInRange(-6, 6),
            speed_y: randomNumberInRange(1, 6),
          });
        }
      }
    }, 5000);
    return () => {
      if (!data.current.started) {
        window.removeEventListener("keydown", (e: KeyboardEvent) =>
          handleKeyPress(e)
        );
        if (intervalId.current) {
          window.clearInterval(intervalId.current);
        }
        window.clearInterval(intervalBonus);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    gsocket.on("connect", () => {
      dispatch(setUserStatus(1));
    });

    gsocket.on("game-start", (dataBack: string) => {
      data.current.NameOfRoom = dataBack;
      SendInfo(dataBack);
      dispatch(setUserStatus(2));
    });

    gsocket.on("pong-init-setup", (playerNumber: number) => {
      data.current.player1.pNumber = playerNumber;
    });

    gsocket.on("goal", async (dataBack: { score1: number; score2: number }) => {
      data.current.score1 = dataBack.score1;
      data.current.score2 = dataBack.score2;
      setScore1(data.current.score1);
      setScore2(data.current.score2);
      data.current.converted = false;
      data.current.paused = 5;
      if (data.current.player1.pNumber === 1) {
        await postScore(
          dataBack.score1,
          dataBack.score2,
          0,
          data.current.gameID
        );
        gsocket.emit("ready", { roomName: data.current.NameOfRoom });
        //gsocket.emit('gameState', {data: data.current, roomName: data.current.NameOfRoom});
      }
    });

    gsocket.on("ready", (dataBack: { sbx: number; sby: number }) => {
      data.current.paused = 5;
      data.current.ball.pos_x = 450 / 2;
      data.current.ball.pos_y = 600 / 2;
      data.current.ball.speed_x = dataBack.sbx;
      data.current.ball.speed_y = dataBack.sby;
      data.current.converted = false;
      if (data.current.spectator === 0) {
        let intervalPause = setInterval(() => {
          if (data.current.paused > 0) {
            data.current.paused -= 1;
          }
        }, 1000);
        if (data.current.paused === 0) {
          clearInterval(intervalPause);
        }
        if (data.current.player1.pNumber === 1 && data.current.paused === 0) {
          gsocket.emit("gameState", {
            data: data.current,
            roomName: data.current.NameOfRoom,
          });
        }
      }
    });

    gsocket.on("leave-game", (roomName: string) => {
      dispatch(setUserStatus(1));
    });

    gsocket.on(
      "paddle-send",
      (dataBack: { playerNumber: number; pos_x: number }) => {
        if (dataBack.playerNumber === data.current.player1.pNumber)
          data.current.player1.pos_x = dataBack.pos_x;
        else if (dataBack.playerNumber === data.current.player2.pNumber)
          data.current.player2.pos_x = 450 - dataBack.pos_x - paddleSize;
      }
    );

    gsocket.on(
      "bonus-send",
      (dataBack: {
        roomName: string;
        pos_x: number;
        pos_y: number;
        playerNumber: number;
        speed_y: number;
        speed_x: number;
      }) => {
        data.current.bonusActive = true;
        if (dataBack.playerNumber === data.current.player1.pNumber) {
          data.current.bonus.pos_x = dataBack.pos_x;
          data.current.bonus.pos_y = dataBack.pos_y;
          data.current.bonus.speed_x = dataBack.speed_x;
          data.current.bonus.speed_y = dataBack.speed_y;
        }
        if (dataBack.playerNumber === data.current.player2.pNumber) {
          data.current.bonus.pos_x = 450 - dataBack.pos_x;
          data.current.bonus.pos_y = 600 - dataBack.pos_y;
          data.current.bonus.speed_x = -dataBack.speed_x;
          data.current.bonus.speed_y = -dataBack.speed_y;
        }
      }
    );

    gsocket.on("bonus-player", (dataBack: { playerNumber: number }) => {
      if (dataBack.playerNumber === data.current.player1.pNumber) {
        data.current.ball.speed_y = -6;
        data.current.bonusActive = false;
      } else if (dataBack.playerNumber === data.current.player2.pNumber) {
        data.current.ball.speed_y = 6;
        data.current.bonusActive = false;
      }
    });

    //new spectate emit
    gsocket.on("spectate", (dataBack: { roomName: string }) => {
      if (
        dataBack.roomName === data.current.NameOfRoom &&
        data.current.player1.pNumber === 1 &&
        data.current.spectator === 0
      ) {
        gsocket.emit("gameState", {
          data: data.current,
          roomName: data.current.NameOfRoom,
        });
      }
    });

    gsocket.on(
      "gameState",
      (dataBack: { data: GameData; roomName: string }) => {
        if (data.current.spectator === 1) {
          data.current = dataBack.data;
          data.current.started = true;
          data.current.spectator = 1;
          setPlayer1(data.current.player1.name);
          setPlayer2(data.current.player2.name);
        }
      }
    );

    gsocket.on(
      "exchange-info",
      async (dataBack: {
        myId: number;
        myName: string;
        myAvatar: string;
        roomName: string;
        playerNumber: number;
      }) => {
        if (
          data.current.player2.id === 0 &&
          data.current.player1.id !== dataBack.myId
        ) {
          data.current.player2.id = dataBack.myId;
          data.current.player2.name = dataBack.myName;
          data.current.player2.avatar = dataBack.myAvatar;
          data.current.player2.pNumber = dataBack.playerNumber;
          data.current.player2.pos_x = 450 - 10 - paddleSize;
        }
        data.current.ball = {
          pos_y: 600 / 2,
          pos_x: 450 / 2,
          speed_y: 1,
          speed_x: 2,
        };
        if (data.current.player1.pNumber === 1) {
          setPlayer1(data.current.player1.name);
          setPlayer2(data.current.player2.name);
          if (data.current.player1.id !== 0 && data.current.player2.id !== 0) {
            let fetchback = await createMatch(
              data.current.player1.id,
              data.current.player2.id
            );
            data.current.gameID = fetchback.id;
            gsocket.emit("setGameId", {
              roomName: data.current.NameOfRoom,
              gameId: fetchback.id,
            });
            gsocket.emit("ready", { roomName: data.current.NameOfRoom });
          }
        } else if (data.current.player1.pNumber === 2) {
          setPlayer1(data.current.player2.name);
          setPlayer2(data.current.player1.name);
        }
        data.current.started = true;
      }
    );

    gsocket.on(
      "forfeit",
      async (dataBack: { player: number; max: number; gameID: number }) => {
        if (data.current.spectator === 0) {
          if (dataBack.player !== data.current.player1.pNumber) {
            if (dataBack.gameID !== 0) data.current.gameID = dataBack.gameID;
            if (data.current.player1.pNumber === 1)
              data.current.score1 = dataBack.max;
            else if (data.current.player1.pNumber === 2)
              data.current.score2 = dataBack.max;
            data.current.paused = 5;
            data.current.started = false;
            data.current.converted = false;
            data.current.bonusActive = false;
            setCanvas(false);
            await postScore(
              data.current.score1,
              data.current.score2,
              1,
              data.current.gameID
            );
            await delay(500);
            try {
              clearInterval(intervalId.current);
              gsocket.emit("bye-bye", {
                roomName: data.current.NameOfRoom,
                user_id: data.current.player1.id,
              });
              bodyNavigate("/Home");
            } catch (e) {
              console.log("error sending home", e);
            }
          } else {
            data.current.started = false;
            data.current.converted = false;
            data.current.bonusActive = false;
            setCanvas(false);
            try {
              clearInterval(intervalId.current);
              bodyNavigate("/Home");
            } catch (e) {
              console.log("error sending home", e);
            }
          }
        }
      }
    );

    gsocket.on("back_to_home", (message: { error: string; reset: boolean }) => {
      toast.error(message.error, {
        position: toast.POSITION.BOTTOM_LEFT,
        className: "toast-error",
      });
      bodyNavigate("/Home");
    });

    gsocket.on(
      "game-over",
      async (dataBack: { score1: number; score2: number }) => {
        data.current.paused = 5;
        let Fball: Ball = {
          pos_y: 40,
          pos_x: 300,
          speed_y: 0,
          speed_x: 0,
        };
        data.current.ball = Fball;
        setScore1(dataBack.score1);
        setScore2(dataBack.score2);
        if (data.current.player1.pNumber === 1)
          await postScore(
            dataBack.score1,
            dataBack.score2,
            1,
            data.current.gameID
          );
        await delay(4500);
        try {
          bodyNavigate("/Home");
        } catch (e) {
          console.log("error sending home", e);
        }
        data.current.started = false;
        data.current.converted = false;
        data.current.bonusActive = false;
        setCanvas(false);
        dispatch(setUserStatus(0));
      }
    );

    gsocket.on("give-roomName", (dataBack: { roomName: string }) => {
      data.current.spectator = 1;
      gsocket.emit("spectate", { roomName: dataBack.roomName });
    });

    return () => {
      gsocket.off("connect");
      gsocket.off("game-start");
      gsocket.off("pong-init-setup");
      gsocket.off("paddle-send");
      gsocket.off("exchange-info");
      gsocket.off("goal");
      gsocket.off("forfeit");
      gsocket.off("game-over");
      gsocket.off("bonus-send");
      gsocket.off("bonus-player");
      gsocket.off("ready");
      gsocket.off("leave-game");
      gsocket.off("spectate");
      gsocket.off("gameState");
      gsocket.off("give-roomName");
      gsocket.off("back-to-home");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gsocket]);

  useEffect(() => {
    gsocket.on("room-join-error", (back: { error: string }) => {
      toast.error(back.error, {
        position: toast.POSITION.BOTTOM_LEFT,
        className: "toast-error",
      });
    });

    return () => {
      gsocket.off("room-join-error");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gsocket]);

  function randomNumberInRange(min: number, max: number) {
    let randRet = Math.floor(Math.random() * (max - min + 1)) + min;
    if (randRet > -2 && randRet < 2) randRet = randomNumberInRange(min, max);
    return randRet;
  }

  function convert(data: GameData, height: number, width: number) {
    data.ball.speed_y *= -1;
    data.ball.speed_x *= -1;
    data.ball.pos_y = height - data.ball.pos_y;
    data.ball.pos_x = width - data.ball.pos_x;
    data.converted = true;
    return data;
  }

  useEffect(() => {
    if (isVisible) {
      //   gsocket.emit('user-left', {way: 0,roomName: data.current.NameOfRoom, playerNumber: data.current.player1.pNumber, time: Date.now()});
    } else {
      gsocket.emit("user-left", {
        roomName: data.current.NameOfRoom,
        playerNumber: data.current.player1.pNumber,
        gameID: data.current.gameID,
      });
    }
  }, [isVisible]);

  const updateGame = async () => {
    try {
      if (!data.current.started) {
        return;
      }
      const canvas = canvasRef.current!;
      if (!canvas) {
        return;
      }
      let ctx = null;
      if (canvas) {
        ctx = canvas.getContext("2d")!;
        if (data.current.player1.pNumber === 2 && !data.current.converted) {
          data.current = convert(data.current, canvas.height, canvas.width);
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const newBallX = data.current.ball.pos_x + data.current.ball.speed_x;
        const newBallY = data.current.ball.pos_y + data.current.ball.speed_y;
        const newBonusX = data.current.bonus.pos_x + data.current.bonus.speed_x;
        const newBonusY = data.current.bonus.pos_y + data.current.bonus.speed_y;
        // limit max ball speed
        if (data.current.ball.speed_y > 10) {
          data.current.ball.speed_y = 10;
        }
        if (data.current.ball.speed_y < -10) data.current.ball.speed_y = -10;
        // bounce off of left/right walls
        if (newBallX < 0 || newBallX > canvas.width) {
          data.current.ball.speed_x = -data.current.ball.speed_x;
        }

        if (newBonusY < 0 || newBonusY > canvas.height) {
          data.current.bonus.speed_y = -data.current.bonus.speed_y;
        }

        if (newBonusX < 0 || newBonusX > canvas.width) {
          data.current.bonus.speed_x = -data.current.bonus.speed_x;
        }
        // check for collision with paddle
        if (
          newBallY < 20 &&
          newBallX >= data.current.player2.pos_x &&
          newBallX <= data.current.player2.pos_x + paddleSize &&
          data.current.ball.speed_y < 0
        ) {
          if (data.current.ball.speed_y > 0) {
            data.current.ball.pos_y = data.current.ball.pos_y - 10;
          } else data.current.ball.speed_y = -data.current.ball.speed_y * 1.25;
          data.current.ball.speed_x = data.current.ball.speed_x * 1.25;
        }
        if (
          newBallY > canvas.height - 20 &&
          newBallX >= data.current.player1.pos_x &&
          newBallX <= data.current.player1.pos_x + paddleSize &&
          data.current.ball.speed_y > 0
        ) {
          if (data.current.ball.speed_y < 0) {
            data.current.ball.pos_y = data.current.ball.pos_y + 10;
          } else data.current.ball.speed_y = -data.current.ball.speed_y * 1.25;
          data.current.ball.speed_x = data.current.ball.speed_x * 1.25;
        }
        if (
          newBonusY < 20 &&
          newBonusX >= data.current.player2.pos_x &&
          newBonusX <= data.current.player2.pos_x + paddleSize
        ) {
          if ((data.current.bonusActive = true)) {
            data.current.bonusActive = false;
            data.current.bonus.pos_x = 100;
            data.current.bonus.pos_y = 100;
            // gsocket.emit('bonus', {roomName: data.current.NameOfRoom, playerNumber: data.current.player2.pNumber});
          }
        }
        if (
          newBonusY > canvas.height - 20 &&
          newBonusX >= data.current.player1.pos_x &&
          newBonusX <= data.current.player1.pos_x + paddleSize
        ) {
          if ((data.current.bonusActive = true)) {
            data.current.bonusActive = false;
            data.current.bonus.pos_x = 100;
            data.current.bonus.pos_y = 100;
            gsocket.emit("bonus", {
              roomName: data.current.NameOfRoom,
              playerNumber: data.current.player1.pNumber,
            });
          }
        }

        // check for goal on player 1 side - change into gsocket goal
        // add a paused effect
        if (newBallY > canvas.height && data.current.paused === 0) {
          if (data.current.player1.pNumber === 1)
            gsocket.emit("goal", {
              score1: data.current.score1,
              score2: data.current.score2 + 1,
              roomName: data.current.NameOfRoom,
            });
          else if (data.current.player1.pNumber === 2)
            gsocket.emit("goal", {
              score1: data.current.score1 + 1,
              score2: data.current.score2,
              roomName: data.current.NameOfRoom,
            });
        } else if (data.current.paused === 0) {
          // calculating new position - keep
          data.current.ball.pos_x = newBallX;
          data.current.ball.pos_y = newBallY;
          if (data.current.bonusActive === true) {
            data.current.bonus.pos_x = newBonusX;
            data.current.bonus.pos_y = newBonusY;
          }
        }
        // drawing elements - keep
        ctx.fillStyle = data.current.color;
        if (cowLogo && data.current.legacy === 1) {
          ctx.drawImage(
            cowLogoImage,
            data.current.ball.pos_x - 20,
            data.current.ball.pos_y - 20,
            40,
            40
          );
        }
        if (supervan && data.current.legacy === 2) {
          ctx.drawImage(
            supervanImage,
            data.current.ball.pos_x - 20,
            data.current.ball.pos_y - 20,
            40,
            40
          );
        }
        if (data.current.paused > 0)
          ctx.fillText(
            data.current.paused.toString(),
            canvas.width / 2,
            canvas.height / 2
          );
        ctx.beginPath();
        if (data.current.bonusActive === true && data.current.gameType === 1) {
          if (collectable) {
            ctx.drawImage(
              collectableImage,
              data.current.bonus.pos_x - 20,
              data.current.bonus.pos_y - 20,
              40,
              40
            );
          }
          // else
          // ctx.arc(data.current.bonus.pos_x, data.current.bonus.pos_y, 10, 0, Math.PI * 2, true);
        }
        ctx.roundRect(
          data.current.player2.pos_x,
          data.current.player2.pos_y,
          paddleSize,
          10,
          5
        );
        ctx.roundRect(
          data.current.player1.pos_x,
          canvas.height - 10,
          paddleSize,
          10,
          5
        );
        ctx.fill();
      }
    } catch (error) {
      console.log("error in updateGame: ", error);
    }
  };

  const SendInfo = (roomToSend: string) => {
    data.current.player1.id = content?.user;
    data.current.player1.name = content?.username;
    data.current.player1.avatar = content?.avatar;
    gsocket.emit("exchange-info", {
      roomName: roomToSend,
      myId: content?.user,
      myName: content?.username,
      myAvatar: content?.avatar,
      playerNumber: data.current.player1.pNumber,
    });
  };

  const Paddles = (roomName: string, newDir: number) => {
    gsocket.emit("paddle-movement", {
      roomName: roomName,
      playerNumber: data.current.player1.pNumber,
      pos_x: data.current.player1.pos_x,
      newDir: newDir,
      speed: data.current.player1.speed,
    });
  };

  const createMatch = async (user1ID: number, user2ID: number) => {
    const response = await fetch(`${process.env.REACT_APP_HOST}api/matches`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ user_1: user1ID, user_2: user2ID }),
    });
    if (response.ok) {
      await updateAchievements(user1ID, user2ID)
      const data = await response.json();
      return data;
    }
  };

  const updateAchievements = async (player1_id: number, player2_id: number) => {
    gsocket.emit("updateAchievements", {
      player1_id: player1_id,
      player2_id: player2_id,
    });
  };

  const postScore = async (
    score1: number,
    score2: number,
    over: number,
    gameID: number
  ) => {
    if (data.current.spectator === 0) {
      await fetch(
        `${process.env.REACT_APP_HOST}api/matches/${gameID}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            score_1: score1,
            score_2: score2,
            status: over,
          }),
        }
      );
    }
  };

  const WaitingRoom = () => {
    if (token !== undefined) {
      content = decodeToken(token);
      gsocket.emit("waitList", { user_id: content.user, bonus: 0 });
      data.current.gameType = 0;
    }
  };

  const WaitingRoom_bonus = () => {
    if (token !== undefined) {
      content = decodeToken(token);
      gsocket.emit("waitList", { user_id: content.user, bonus: 1 });
      data.current.gameType = 1;
    }
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    switch (e.key) {
      case "ArrowLeft":
        if (data.current.player1.pos_x >= 25 && data.current.spectator === 0)
          Paddles(data.current.NameOfRoom, -1);
        break;
      case "ArrowRight":
        if (data.current.player1.pos_x <= 325 && data.current.spectator === 0)
          Paddles(data.current.NameOfRoom, 1);
        break;
      default:
        break;
    }
  };
  return (
    <div className="flex flex-col lg:flex-row justify-center h-full items-center w-full overflow-hidden">
      <div>
        <canvas
          className="border-solid border-2 border-white h-max-full w-max-full object-contain"
          ref={canvasRef as React.RefObject<HTMLCanvasElement> | null}
          width={450}
          height={600}
        ></canvas>
        <div className="border-solid border-2 border-white max-w-[454px] text-lg">
          <span>
            {player1}: {score1disp}
            <br />
            {player2}: {score2disp}
          </span>
        </div>
      </div>
      <div className="border-solid border-2 border-white h-[604px] w-[454px] lg:w-auto ring-offset-1 flex flex-col lg:self-start justify-between text-lg p-5">
        <img src="../cow.png" alt="Ball" style={{ display: "none" }} />
        <button
          className="bg-stone-50 hover:bg-stone-500 text-black font-bold py-2 px-4 rounded mb-4"
          onClick={WaitingRoom}
        >
          Waiting Room
        </button>
        <button
          className="bg-stone-50 hover:bg-stone-500 text-black font-bold py-2 px-4 rounded mb-4"
          onClick={WaitingRoom_bonus}
        >
          Waiting Room bonus
        </button>
        <br />
        <button
          className="bg-stone-50 hover:bg-stone-500 text-black font-bold py-2 px-4 rounded mb-4"
          onClick={() => {
            data.current.color = "pink";
          }}
        >
          PINK
        </button>
        <button
          className="bg-stone-50 hover:bg-stone-500 text-black font-bold py-2 px-4 rounded mb-4"
          onClick={() => {
            data.current.color = "blue";
          }}
        >
          BLUE
        </button>
        <br />
        <button
          className="bg-stone-50 hover:bg-stone-500 text-black font-bold py-2 px-4 rounded mb-4"
          onClick={() => {
            data.current.legacy = 1;
          }}
        >
          COWMOOO
        </button>
        <button
          className="bg-stone-50 hover:bg-stone-500 text-black font-bold py-2 px-4 rounded mb-4"
          onClick={() => {
            data.current.legacy = 2;
          }}
        >
          SUPERVAN!
        </button>
      </div>
    </div>
  );
};

export default GameSocket;
