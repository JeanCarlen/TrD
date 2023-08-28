import React, { Component } from 'react';
import './PongGame.css';
import './Game.css'
import logo from '../cow.svg'

interface State {
  ballX: number;
  ballY: number;
  ballSpeedX: number;
  ballSpeedY: number;
  leftPaddleY: number;
  rightPaddleY: number;
  scoreLeft: number;
  scoreRight: number;
}

class PongGame extends Component<{}, State> {
  private canvasRef: React.RefObject<HTMLCanvasElement>;
  private intervalId: number;

  constructor(props: {}) {
    super(props);

    this.state = {
      ballX: 100,
      ballY: 100,
      ballSpeedX: 5,
      ballSpeedY: 3,
      leftPaddleY: 150,
      rightPaddleY: 150,
      scoreLeft: 0,
      scoreRight: 0,
	 };

	this.intervalId = 0;
    this.canvasRef = React.createRef();
    this.updateGame = this.updateGame.bind(this);

  }

  componentDidMount() {
    this.intervalId = window.setInterval(this.updateGame, 1000 / 60); // 60 FPS
    window.addEventListener('keydown', this.handleKeyPress);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
    window.removeEventListener('keydown', this.handleKeyPress);
  }


  updateGame() {
    const canvas = this.canvasRef.current!;

	if (!canvas)
		return
    const ctx = canvas.getContext('2d')!;

    const { ballX, ballY, ballSpeedX, ballSpeedY, leftPaddleY, rightPaddleY } = this.state;

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
      (newBallX < 15 && newBallY > leftPaddleY && newBallY < leftPaddleY + 80) ||
      (newBallX > canvas.width - 15 && newBallY > rightPaddleY && newBallY < rightPaddleY + 80)
    ) {
      this.setState({ ballSpeedX: -ballSpeedX });
    }

    // Check scoring
    if (newBallX < 0) {
      this.setState((prevState) => ({ ballX: canvas.width / 2, ballY: canvas.height / 2, scoreRight: prevState.scoreRight + 1 }));
    } else if (newBallX > canvas.width) {
      this.setState((prevState) => ({ ballX: canvas.width / 2, ballY: canvas.height / 2, scoreLeft: prevState.scoreLeft + 1 }));
    } else {
      this.setState({ ballX: newBallX, ballY: newBallY });
    }

	//const ballImage = new Image();
	const cowLogo = new Image();
	cowLogo.src = '../cow.png';
    // Draw paddles and ball
    ctx.fillStyle = 'pink';
    // ctx.fillRect(10, leftPaddleY, 10, 80);
    ctx.fillRect(canvas.width - 20, rightPaddleY, 10, 80);
	//ctx.drawImage(this.ballImage, ballX -10, ballY -10, 20, 20);
	ctx.drawImage(cowLogo, ballX - 10, ballY - 10, 20, 20);
    ctx.beginPath();
	ctx.roundRect(10, leftPaddleY, 10, 115, 5);
    // ctx.arc(ballX, ballY, 10, 0, Math.PI * 2);
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
		<img src={logo} className='ball'/>
          <span>Left Player: {this.state.scoreLeft}</span>
          <span>Right Player: {this.state.scoreRight}</span>
        </div>
      </div>
    );
  }
}

export default PongGame;
