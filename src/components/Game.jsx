import { useEffect, useState } from "react";

const RIDDLE_API = import.meta.env.RIDDLE_API;
const SIMILARITY_API = import.meta.env.SIMILARITY_API;
const API_KEY = import.meta.env.MY_API_KEY;

export default function Game() {
  const [riddle, setRiddle] = useState({});
  const [answer, setAnswer] = useState("");
  const [similarityResult, setSimilarityResult] = useState(null);
  const [points, setPoints] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  async function fetchRiddle() {
    try {
      const res = await fetch(RIDDLE_API, {
        method: "GET",
        headers: {
          "X-Api-Key": API_KEY,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        throw new Error(`Error: ${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      if (data.length > 0) {
        setRiddle(data[0]);
        console.log(data[0]); // Adjust based on the actual API response structure
      }
    } catch (error) {
      console.error("Error fetching the riddle:", error);
    }
  }
  useEffect(() => {
    fetchRiddle();
  }, []);

  useEffect(() => {
    if (similarityResult !== null) {
      if (similarityResult > 0.5) {
        setPoints((prevPoints) => prevPoints + 1);
      }
    }
  }, [similarityResult]);

  const checkTextSimilarity = async () => {
    try {
      const res = await fetch(SIMILARITY_API, {
        method: "POST",
        headers: {
          "X-Api-Key": API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text_1: answer,
          text_2: riddle.answer,
        }),
      });
      if (!res.ok) {
        throw new Error(`Error: ${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      setSimilarityResult(data.similarity);
      console.log(data);
    } catch (error) {
      console.error("Error checking text similarity:", error);
    }
  };

  const handleAnswer = (e) => {
    e.preventDefault();
    checkTextSimilarity();
    setAnswer("");
  };

  const nextRiddle = async () => {
    await fetchRiddle();
    setSimilarityResult(null);
    setAnswer(""); // Ensure fetchRiddle is properly defined as an async function
  };

  const handleGameOver = () => {
    setGameOver(true);
    //setPoints(0);
  };

  const resultMessage =
    similarityResult !== null
      ? similarityResult > 0.5
        ? "✅ Correct answer!"
        : `❌ Wrong answer! Correct answer is: ${riddle.answer}`
      : null;

  return (
    <div className="flex p-10 space-y-10 text-center flex-col justify-center items-center">
      {!gameOver ? (
        <>
          <h1 className="text-3xl md:text-6xl">Total points: {points}</h1>
          {/* <h1 className="text-6xl md:text-7xl">Riddle:</h1> */}
          {resultMessage && <div className="text-3xl">{resultMessage}</div>}
          {riddle.title && (
            <h1 className="text-4xl md:text-5xl">{riddle.title}</h1>
          )}
          {riddle.question && (
            <p className="text-2xl md:text-4xl">{riddle.question}</p>
          )}

          <form
            onSubmit={handleAnswer}
            className="flex flex-col justify-center items-center space-y-10"
          >
            {similarityResult ? (
              ""
            ) : (
              <div className="flex flex-col justify-center items-center space-y-5">
                <textarea
                  required
                  className="outline shadow-2xl p-3 rounded-lg outline-1"
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Type your answer here..."
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white text-2xl md:text-3xl p-5 rounded-lg"
                >
                  Check Answer
                </button>
              </div>
            )}
          </form>
          <div className="flex flex-col space-y-5 md:space-y-0 justify-center items-center md:flex-row md:space-x-5">
            <button
              onClick={nextRiddle}
              className="bg-blue-500 text-white text-2xl md:text-3xl p-5 rounded-lg"
            >
              Next Riddle
            </button>
            <button
              onClick={handleGameOver}
              className="bg-blue-500 text-white text-2xl md:text-3xl p-5 rounded-lg"
            >
              Quit Game
            </button>
          </div>
        </>
      ) : (
        <div className="space-y-10">
          <h1 className="text-6xl ">Total Points: {points}</h1>
          <button
            onClick={async () => {
              await fetchRiddle();
              setGameOver(false);
              setPoints(0);
              setSimilarityResult(null);
            }}
            className="text-white rounded-lg bg-blue-500 p-3 text-3xl"
          >
            New Game
          </button>
        </div>
      )}
    </div>
  );
}
