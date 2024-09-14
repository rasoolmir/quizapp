import React, { useRef, useState, useEffect } from 'react';
import './Quiz.css';
import { data } from '../../assets/data';

const Quiz = () => {
    // State variables to manage quiz state
    let [index, setIndex] = useState(0);
    let [question, setQuestion] = useState(data[index]);
    const [lock, setLock] = useState(false);
    let [score, setScore] = useState(0);
    const [result, setResult] = useState(false);
    const [timeLeft, setTimeLeft] = useState(10); // Initial timer value
    const totalTime = 10; // Total time for each question
    const [selectedOptions, setSelectedOptions] = useState(Array(data.length).fill(null));

    // References for option elements
    let Option1 = useRef(null);
    let Option2 = useRef(null);
    let Option3 = useRef(null);
    let Option4 = useRef(null);

    let option_array = [Option1, Option2, Option3, Option4];

    // Function to check if the selected answer is correct
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

    //next question
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

    //previous question
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

    // Timer implementation
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
    }, [timeLeft, index]);

    const progress = (1 - timeLeft / totalTime) * 100;

    // Reset the quiz to initial state
    const reset = () => {
        setIndex(0);
        setQuestion(data[0]);
        setScore(0);
        setLock(false);
        setResult(false);
        setTimeLeft(totalTime); // Reset timer
    }

    return(
    <div className='quiz'>
      {!result && (
        <header className="quiz__header">
          <button className= "quiz__button--back" onClick={previous}> Previous</button>
          <div className="quiz__index">{index + 1} / {data.length}</div>
          </header>
        )}
        
        {result ? <></> : <>
        <div className="quiz__circle" style={{ background: `conic-gradient(#3EB8D4 ${progress}%, #e0e0e0 ${progress}%)` }}>
          <span className="quiz__circle-text">{timeLeft}</span>
          </div>
            <div className="quiz__question-box">
              <h2>{index+1}. {question.question}</h2>
            </div>
            <ul className="quiz__list">
              <li className="quiz__item" ref={Option1} onClick={(e) => checkAnswer(e,1)}>{question.option1}</li>
              <li className="quiz__item" ref={Option2} onClick={(e) => checkAnswer(e,2)}>{question.option2}</li>
              <li className="quiz__item" ref={Option3} onClick={(e) => checkAnswer(e,3)}>{question.option3}</li>
              <li className="quiz__item" ref={Option4} onClick={(e) => checkAnswer(e,4)}>{question.option4}</li>
            </ul>
            <button className='quiz__button--next' onClick={next}>Next</button>
          </>}
          {result ? <>
           <h2 className='quiz__result-text'>You Scored {score} out of {data.length} </h2>
           <button className='quiz__button--reset' onClick={reset}>Reset</button>
          </>:<></>}
     </div>
     )
}

export default Quiz;
