
import './App.css';
import React, { useState, useEffect } from 'react';
function App() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [numCorrectAnswers, setNumCorrectAnswers] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showExitButton, setShowExitButton] = useState(false);

  useEffect(() => {
    if (quizStarted) {
      fetchQuestions();
    }
  }, [quizStarted]);

  const fetchQuestions = async () => {
    try {
      const response = await fetch('https://opentdb.com/api.php?amount=5');
      const data = await response.json();
      setQuestions(data.results);
      setShowExitButton(true);
    } catch (error) {
      console.log('Lỗi khi lấy dữ liệu câu hỏi từ API:', error);
    }
  };

  const startQuiz = () => {
    setQuizStarted(true);
  };

  const exitQuiz = () => {
    setQuizStarted(false);
    setQuizCompleted(false);
    setCurrentQuestionIndex(0);
    setNumCorrectAnswers(0);
    setSelectedAnswer(null);
    setQuestions([]);
    setShowExitButton(false);
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setSelectedAnswer(null);
    } else {
      setQuizCompleted(true);
      setShowExitButton(false);
    }
  };

  const handleAnswerSelection = (answer) => {
    setSelectedAnswer(answer);
  };

  const checkAnswer = () => {
    if (selectedAnswer === null) {
      return(
        alert("Bạn chưa chọn đáp án .Vui lòng chọn đáp án")
      ) 
    }
    
    const currentQuestion = questions[currentQuestionIndex];
    if (selectedAnswer === currentQuestion.correct_answer) {
      setNumCorrectAnswers(prevNum => prevNum + 1);
    }
    goToNextQuestion();
  };

  const renderQuestion = () => {
    const question = questions[currentQuestionIndex];
    const answers = [question.correct_answer, ...question.incorrect_answers];

    return (
      <div>
        <h2 className='questiontitle'>Câu hỏi {currentQuestionIndex + 1}/{questions.length}</h2>
        <h3 className='questiontext'>{question.question}</h3>

        {answers.map((answer, index) => (
          <div key={index}>
            <label>
              <input
                type="radio"
                value={answer}
                checked={selectedAnswer === answer}
                onChange={() => handleAnswerSelection(answer)}
              />
              {answer}
            </label>
          </div>
        ))}

        <button className='button-62' onClick={checkAnswer}>Tiếp tục</button>
        {showExitButton && <button  className='button-62' onClick={exitQuiz}>Thoát</button>}
      </div>
    );
  };

  const renderQuizCompleted = () => {
    const passingCriteria = 3; 
    const fail= numCorrectAnswers >3;
    const isPassed = numCorrectAnswers >= passingCriteria;
    
    return (
      <div>
        <h2 className='endquiz'>Kết thúc bài kiểm tra</h2>
        <p className='endtextquiz'>Số câu hỏi đúng: {numCorrectAnswers}/{questions.length}</p>
        <p className='endtextquiz'>{fail ? 'Tiếp tục phấn đấu lên nào!' : 'Hãy cố gắng thêm một chút nữa!'}</p>
        <p className='endtextquiz'>Thông báo kết quả: {isPassed ? 'Thành công' : 'Thất bại'}</p>
        <button  className='button-62' onClick={exitQuiz}>Quay lại</button>
      </div>
    );
  };

  const renderStartButton = () => {
    return (
      <div>
        <h2 className='titleapp'>Ứng dụng Quiz</h2>
        <h2 className='buttonfirstpage'><button className='button-75' onClick={startQuiz}>Bắt đầu</button></h2>
      </div>
    );
  };

  return (
    <div>
      {!quizStarted ? (
        renderStartButton()
      ) : !quizCompleted ? (
        questions[currentQuestionIndex] && renderQuestion()
      ) : (
        renderQuizCompleted()
      )}
    </div>
  );
}

export default App;
