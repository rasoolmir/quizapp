import React, { useRef, useState, useEffect } from 'react';
import './Quiz.css'
import { data } from '../../assets/data';

const Quiz = () => {

    let [index,setIndex] = useState(0);
    let [question,setQuestion]= useState(data[index]);
    const [lock, setLock] = useState(false);
    let [score, setScore] = useState(0);
    const [result, setResult] = useState(false);
    const [timeLeft, setTimeLeft] = useState(10); //first time
    const totalTime = 10; // All of time
    const [selectedOptions, setSelectedOptions] = useState(Array(data.length).fill(null));
    

    // options 
    let Option1 = useRef(null);
    let Option2 = useRef(null);
    let Option3 = useRef(null);
    let Option4 = useRef(null);

    let option_array = [Option1,Option2,Option3,Option4];


    // checke Answer (true or flase)
    const checkAnswer = (e, answer) => {
      if (!lock) {
        const newSelectedOptions = [...selectedOptions];
        newSelectedOptions[index] = answer;
        setSelectedOptions(newSelectedOptions);
    
        if (question.answer === answer) {
          e.target.classList.add("correct");
          setScore(prev => prev + 1);
        } else {
          e.target.classList.add("wrong");
          option_array[question.answer - 1].current.classList.add("correct");
        }
        setLock(true);
      }
    };
    

    
    // next button 
    const next = () => {
      if (lock) {
        if (index === data.length - 1) {
          setResult(true);
          return;
        }
    
        setIndex(prevIndex => prevIndex + 1);
        setQuestion(data[index + 1]);
        setLock(selectedOptions[index + 1] !== null);
    
        option_array.forEach((option, i) => {
          option.current.classList.remove("wrong", "correct");
          if (selectedOptions[index + 1] === i + 1) {
            option.current.classList.add(question.answer === i + 1 ? "correct" : "wrong");
          }
        });
      }
    };

    // Back button
    const previous = () => {
      if (index > 0) {
        setIndex(prevIndex => prevIndex - 1);
        setQuestion(data[index - 1]);
        setLock(selectedOptions[index - 1] !== null);
    
        option_array.forEach((option, i) => {
          option.current.classList.remove("wrong", "correct");
          if (selectedOptions[index - 1] === i + 1) {
            option.current.classList.add(question.answer === i + 1 ? "correct" : "wrong");
          }
        });
      }
    };

    // timer
    useEffect(() => {
      if (timeLeft > 0) {
        const timer = setInterval(() => {
          setTimeLeft(prevTime => prevTime - 1);
        }, 1000);
        return () => clearInterval(timer);
      } else {
        setLock(true);
        const correctOption = option_array[question.answer - 1];
        if (correctOption && correctOption.current) {
          correctOption.current.classList.add("correct");
        }
      }
    }, [timeLeft, index]); const progress = (1 - timeLeft / totalTime) * 100;

    // reset button come back one page
    const reset = () => {
        setIndex(0);
        setQuestion(data[0]);
        setScore(0);
        setLock(false);
        setResult(false);
        setTimeLeft(totalTime); // reset timer
    }

    return(
    <div className='container'>
      {!result && (
        <header className="header">
          <button className= "back-btn" onClick={previous}> Previous</button>
          <div className="index">{index + 1} / {data.length}</div>
          </header>
        )}
        
        {result ? <></> : <>
        <div className="circle" style={{ background: `conic-gradient(#3EB8D4 ${progress}%, #e0e0e0 ${progress}%)` }}>
          <span className="circle-text">{timeLeft}</span>
          </div>
            <div className="question-box">
              <h2>{index+1}. {question.question}</h2>
            </div>
            <ul>
              <li ref={Option1} onClick={(e) => checkAnswer(e,1)}>{question.option1}</li>
              <li ref={Option2} onClick={(e) => checkAnswer(e,2)}>{question.option2}</li>
              <li ref={Option3} onClick={(e) => checkAnswer(e,3)}>{question.option3}</li>
              <li ref={Option4} onClick={(e) => checkAnswer(e,4)}>{question.option4}</li>
            </ul>
            <button className='next-btn' onClick={next}>Next</button>
          </>}
          {result ? <>
           <h2 className='result-text'>You Scored {score} out of {data.length} </h2>
           <button className='reset-btn' onClick={reset}>Reset</button>
          </>:<></>}
     </div>
     )

    }
  export default Quiz