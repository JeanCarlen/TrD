import React, { Component } from 'react';
import './PongGame.css';
import './Game.css';
import cowLogo from '../cow.png';

interface State {
  ballX: number;
  ballY: number;
  ballSpeedX: number;
  ballSpeedY: number;
  leftPaddleY: number;
  rightPaddleY: number;
  scoreLeft: number;
  scoreRight: number;
  paddleSize: number;
  cowLogo: HTMLImageElement | null;
}

class PongGame extends Component<{}, State> {
  private canvasRef: React.RefObject<HTMLCanvasElement>;
  private intervalId: number;

  constructor(props: {}) {
    super(props);

    this.state = {
      ballX: 100,
      ballY: 100,
      ballSpeedX: 3,
      ballSpeedY: 5,
      leftPaddleY: 150,
      rightPaddleY: 150,
      scoreLeft: 0,
      scoreRight: 0,
      paddleSize: 120,
      cowLogo: null,
    };

    this.intervalId = 0;
    this.canvasRef = React.createRef();
    this.updateGame = this.updateGame.bind(this);
  }

  componentDidMount() {
    this.intervalId = window.setInterval(this.updateGame, 1000 / 60); // 60 FPS
    window.addEventListener('keydown', this.handleKeyPress);

    // Load cow image
    const cowLogoImage = new Image();
    cowLogoImage.src = cowLogo;
    cowLogoImage.onload = () => {
      this.setState({ cowLogo: cowLogoImage });
    };
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
    window.removeEventListener('keydown', this.handleKeyPress);
  }


  updateGame() {
    const canvas = this.canvasRef.current!;
    if (!canvas) return;

    const ctx = canvas.getContext('2d')!;
    const { ballX, ballY, ballSpeedX, ballSpeedY, leftPaddleY, rightPaddleY, cowLogo, paddleSize} = this.state;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update ball position
    const newBallX = ballX + ballSpeedX;
    const newBallY = ballY + ballSpeedY;

    // Check collision with top/bottom walls
    if (newBallY < 0 || newBallY > canvas.height) {
      this.setState({ ballSpeedY: -ballSpeedY });
    }

    // Check collision with paddles
    if (
      (newBallX < 25 && newBallY > leftPaddleY && newBallY < leftPaddleY + paddleSize) ||
      (newBallX > canvas.width - 25 && newBallY > rightPaddleY && newBallY < rightPaddleY + paddleSize)
    ) {
      this.setState({ ballSpeedX: -ballSpeedX * 1.1 });
      //this.setState({ ballSpeedX: ballSpeedX*1.2 });
      this.setState({ ballSpeedY: ballSpeedY*1.2 });
    }

    // Check scoring
    if (newBallX < 0) {
      this.setState((prevState) => ({ ballX: canvas.width / 2, ballY: canvas.height / 2, scoreRight: prevState.scoreRight + 1 }));
      this.setState({ballSpeedX: -3, ballSpeedY: -5});
    } else if (newBallX > canvas.width) {
      this.setState((prevState) => ({ ballX: canvas.width / 2, ballY: canvas.height / 2, scoreLeft: prevState.scoreLeft + 1}));
      this.setState({ballSpeedX: 3, ballSpeedY: 5});
    } else {
      this.setState({ ballX: newBallX, ballY: newBallY });
    }

    ctx.fillStyle = 'pink';
    //ctx.fillRect(canvas.width - 20, rightPaddleY, 10, paddleSize);
    if (cowLogo)
    {
      ctx.drawImage(cowLogo, ballX -25, ballY -25, 50, 50);
    }
	//ctx.drawImage(this.ballImage, ballX -10, ballY -10, 20, 20);
	// ctx.drawImage(cowLogo, ballX - 10, ballY - 10, 20, 20);
    ctx.beginPath();
	ctx.roundRect(10, leftPaddleY, 10, paddleSize, 5);
    ctx.roundRect(canvas.width - 20, rightPaddleY, 10, paddleSize, 5);
    //ctx.arc(ballX, ballY, 10, 0, Math.PI * 2);
    ctx.fill();

	console.log("X: ",ballX, " Y: ", ballY);


    // Update paddle positions (you can modify this to use keys)
    this.setState({ leftPaddleY: Math.min(Math.max(leftPaddleY, 0), canvas.height - 80) });
    this.setState({ rightPaddleY: Math.min(Math.max(rightPaddleY, 0), canvas.height - 80) });
  }

  handleKeyPress = (e: KeyboardEvent) => {
    const { leftPaddleY, rightPaddleY } = this.state;
    const speed = 50;

    switch (e.key) {
      case 'ArrowUp':
        this.setState({ rightPaddleY: rightPaddleY - speed });
        break;
      case 'ArrowDown':
        this.setState({ rightPaddleY: rightPaddleY + speed });
        break;
      case 'w':
        this.setState({ leftPaddleY: leftPaddleY - speed });
        break;
      case 's':
        this.setState({ leftPaddleY: leftPaddleY + speed });
        break;
      default:
        break;
    }
  };

  render() {
    return (
      <div>
        <canvas ref={this.canvasRef} width={800} height={600}></canvas>
        <div className="score">
		<img
        src="../cow.png"
        alt="Ball"
        style={{ display: 'none' }}/>
                <span>Left Player: {this.state.scoreLeft}</span>
          <span>Right Player: {this.state.scoreRight}</span>
        </div>
      </div>
    );
  }
}

export default PongGame;
