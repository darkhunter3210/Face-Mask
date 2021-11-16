import React from 'react';
import '../App.css';
import { Button } from './Button';
import './HeroSection.css';

function HeroSection() {
  return (
    <div className='hero-container' id="intro">
      <video src='/videos/video-1.mp4' autoPlay loop muted />
      <h1>Wear a mask, is your task</h1>
      <p>We will find you if you don't</p>
      <div className='hero-btns'>
        <Button
          className='btns'
          buttonStyle='btn--outline'
          buttonSize='btn--large'
        >
          Image
        </Button>
        <Button
          className='btns'
          buttonStyle='btn--primary'
          buttonSize='btn--large'
          onClick={console.log('hey')}
        >
          Stream <i className='far fa-play-circle' />
        </Button>
      </div>
    </div>
  );
}

export default HeroSection;