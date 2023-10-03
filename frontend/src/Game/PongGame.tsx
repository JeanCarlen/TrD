import React, { Component } from 'react';
import { useEffect, useState } from 'react';
import './PongGame.css';
import cowLogo from '../cow.png';

interface State {
  ballX: number;
  ballY: number;
  ballSpeedX: number;
  ballSpeedY: number;
  UpPaddle: number;
  DownPaddle: number;
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
      UpPaddle: 100,
      DownPaddle: 500,
      scoreLeft: 0,
      scoreRight: 0,
      paddleSize: 1300,
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
    const {
      ballX,
      ballY,
      ballSpeedX,
      ballSpeedY,
      UpPaddle,
      DownPaddle,
      cowLogo,
      paddleSize,
    } = this.state;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update ball position
    const newBallX = ballX + ballSpeedX;
    const newBallY = ballY + ballSpeedY;

    // Check collision with top/bottom walls
	if((ballSpeedX > 20 )|| ballSpeedX < -20)
	{
		this.setState({ ballSpeedX: 20 });
		this.setState({ ballSpeedY: 20 });
	}
    if (newBallX < 0 || newBallX > canvas.width) {
      this.setState({ ballSpeedX: -ballSpeedX });
    }

    if (
      (newBallY < 10 && (newBallX >= UpPaddle && newBallX <= UpPaddle + paddleSize)) ||
      (newBallY > canvas.height - 20 && (newBallX >= DownPaddle && newBallX <= DownPaddle + paddleSize))
    ) 
    {
      this.setState({ ballSpeedX: ballSpeedX * 1.05 });
      this.setState({ ballSpeedY: -ballSpeedY * 1.05 });
    }

    // Check scoring
    if (newBallY < 0) {
      this.setState((prevState) => ({ ballX: canvas.width / 2, ballY: canvas.height / 2, scoreRight: prevState.scoreRight + 1 }));
      this.setState({ ballSpeedX: 3, ballSpeedY: 5 });
    } else if (newBallY > canvas.height) {
      this.setState((prevState) => ({ ballX: canvas.width / 2, ballY: canvas.height / 2, scoreLeft: prevState.scoreLeft + 1 }));
      this.setState({ ballSpeedX: -3, ballSpeedY: -5 });
    } else {
      this.setState({ ballX: newBallX, ballY: newBallY });
    }

    ctx.fillStyle = 'pink';
    if (cowLogo) {
      ctx.drawImage(cowLogo, ballX - 25, ballY - 25, 50, 50);
    }

    // Draw paddles and ball
    ctx.beginPath();
	ctx.roundRect(DownPaddle, canvas.height - 20, paddleSize, 10, 5);
    ctx.roundRect(UpPaddle, 10, paddleSize, 10, 5);
    // ctx.rect(UpPaddle - paddleSize, 10, paddleSize, 10);
    // ctx.rect(DownPaddle - paddleSize, canvas.height - 20, paddleSize, 10);
    // ctx.arc(ballX, ballY, 10, 0, Math.PI * 2);
    ctx.fill();
  }

  handleKeyPress = (e: KeyboardEvent) => {
    const { UpPaddle, DownPaddle } = this.state;
    const speed = 110;

    switch (e.key) {
      case 'ArrowLeft':
        this.setState({ UpPaddle: UpPaddle - speed });
        break;
      case 'ArrowRight':
        this.setState({ UpPaddle: UpPaddle + speed });
        break;
      case 'a':
        this.setState({ DownPaddle: DownPaddle - speed });
        break;
      case 'd':
        this.setState({ DownPaddle: DownPaddle + speed });
        break;
      default:
        break;
    }
  };

  render() {
    return (
      <div>
		<div className="game">
        <canvas ref={this.canvasRef} width={600} height={800}></canvas>
        <div className="score">
          <img src="../cow.png" alt="Ball" style={{ display: 'none' }} />
          <span>bob: {this.state.scoreLeft}</span>
          <br/>
          <span>keenu reeves: {this.state.scoreRight}</span>
        </div>
      </div>
	  </div>
    );
  }
}

export default PongGame;
