import { useEffect, useState } from "react";
import Box from "../Box";
import words from "../../words";

// Declare a constant variable to store the random numbers
const correctNumbers = [];

// Generate 8 random numbers between 0 and 9 and add them to the array
for (let i = 0; i < 10; i++) {
  const randNumberAsString = Math.floor(Math.random() * 10).toString();
  correctNumbers.push(randNumberAsString);
}
let defaulBoard = [];
let defaultLetters = [];

"0123456789".split("").forEach((i) => {
  defaultLetters[i] = "";
});

for (let i = 0; i < 8; i++) {
  defaulBoard.push([]);
  for (let j = 0; j < 10; j++) {
    defaulBoard[i].push(["", ""]);
  }
}

function Board(props) {
  const [letters, setLetters] = useState(defaultLetters);
  const [board, setBoard] = useState(defaulBoard);
  const [changed, setChanged] = useState(false);
  const [row, setRow] = useState(0);
  const [col, setCol] = useState(0);
  const [win, setWin] = useState(false);
  const [lost, setLost] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (win || lost) {
      console.log("Game ended!");
    } else {
      if (props.clicks !== 0) {
        if (props.letter === "DEL") {
          setCol(col === 0 ? 0 : col - 1);
          setBoard((prevBoard) => {
            prevBoard[row][col === 0 ? 0 : col - 1][0] = "";
            return prevBoard;
          });
        } else {
          setBoard((prevBoard) => {
            if (col < 10) {
              if (props.letter !== "ENTER") {
                prevBoard[row][col][0] = props.letter;
                setCol(col + 1);
              } else {
                props.error("Words are 10 letters long!");
                setTimeout(() => {
                  props.error("");
                }, 1000);
              }
            } else {
              if (props.letter === "ENTER") {
                const correctNumberDict = {};

                for (let i = 0; i < correctNumbers.length; i++) {
                  const element = correctNumbers[i];
                  if (correctNumberDict[element]) {
                    correctNumberDict[element]++;
                  } else {
                    correctNumberDict[element] = 1;
                  }
                }

                let correctGuesses = 0;
                let word = "";
                for (let i = 0; i < 10; i++) {
                  word += prevBoard[row][i][0];
                }
                console.log(correctNumbers)
                for (let i = 0; i < 10; i++) {
                  console.log(prevBoard[row][i][0])
                  if (correctNumbers[i] === prevBoard[row][i][0]) {
                    prevBoard[row][i][1] = "C";
                    correctNumberDict[prevBoard[row][i][0]]--;
                    correctGuesses++;
                  }
                }
                for (let i = 0; i < 10; i++) {
                  if (correctNumberDict.hasOwnProperty(prevBoard[row][i][0]) && prevBoard[row][i][1] !== "C" && correctNumberDict[prevBoard[row][i][0]] > 0) {
                    console.log(prevBoard[row][i][1])
                    prevBoard[row][i][1] = "E";
                    correctNumberDict[prevBoard[row][i][0]]--;
                  } else {
                    if (prevBoard[row][i][1] !== "E" && prevBoard[row][i][1] !== "C") {
                      prevBoard[row][i][1] = "N";
                    }
                  }
                  setRow(row + 1);
                  if (row === 7) {
                    setLost(true);
                    setTimeout(() => {
                      setMessage(`It was ${correctNumbers}`);
                    }, 750);
                  }

                  setCol(0);
                  setLetters((prev) => {
                    prev[board[row][i][0]] = "";
                    return prev;
                  });
                }
                setChanged(!changed);

                if (correctGuesses === 10) {
                  setWin(true);
                  setTimeout(() => {
                    setMessage("You WIN");
                  }, 750);
                }
                return prevBoard;
              }
            }
            return prevBoard;
          });
        }
      }
    }
  }, [props.clicks]);

  useEffect(() => {
    props.letters(letters);
  }, [changed]);

  return (
    <div className="px-10 py-5 grid gap-y-1 items-center w-100 justify-center">
      {board.map((row, key) => {
        return (
          <div key={key} className="flex gap-1 w-fit">
            {row.map((value, key) => (
              <Box key={key} value={value[0]} state={value[1]} pos={key} />
            ))}
          </div>
        );
      })}
      <div className=" grid place-items-center h-8 font-bold dark:text-white">
        {lost || win ? message : ""}
      </div>
    </div>
  );
}

export default Board;
