export default function StartScreen({ setGameRun }) {
  return (
    <div className="flex space-y-10 flex-col justify-center items-center h-screen">
      <h1 className="text-6xl md:text-9xl">Riddlr</h1>
      <img className="max-w-64" src="/riddlr.jpg" alt="" />
      <p className="text-3xl md:text6xl">the riddle game</p>
      <button
        onClick={() => setGameRun(true)}
        className="text-3xl md:text-6xl bg-blue-400 text-white p-5"
      >
        Play
      </button>
    </div>
  );
}
