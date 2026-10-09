import { useEffect, useState } from "react";
import { FiArrowRight, FiCheck, FiPlus, FiRotateCcw } from "react-icons/fi";
import styles from "./styles.module.css";
const starter = [
    { prompt: "Which property makes a flex item grow into available space?", options: ["flex-grow", "flex-wrap", "flex-basis", "align-self"], answer: "flex-grow" },
    { prompt: "Which hook stores local component state?", options: ["useRef", "useMemo", "useState", "useId"], answer: "useState" },
    { prompt: "What does JSON.parse() return?", options: ["A JavaScript value", "A network response", "A DOM node", "A string only"], answer: "A JavaScript value" },
];
const loadBank = () => { try { return JSON.parse(localStorage.getItem("quizcraft-bank")) || starter; } catch { return starter; } };
const QuizPracticeBuilder = () => {
    const [bank, setBank] = useState(loadBank); const [phase, setPhase] = useState("ready"); const [index, setIndex] = useState(0); const [choice, setChoice] = useState(""); const [score, setScore] = useState(0);
    const [prompt, setPrompt] = useState(""); const [answer, setAnswer] = useState(""); const [distractor, setDistractor] = useState("");
    useEffect(() => localStorage.setItem("quizcraft-bank", JSON.stringify(bank)), [bank]);
    const start = () => { setIndex(0); setScore(0); setChoice(""); setPhase("playing"); };
    const next = () => { if (choice === bank[index].answer) setScore((value) => value + 1); if (index + 1 === bank.length) setPhase("result"); else setIndex((value) => value + 1); setChoice(""); };
    const addQuestion = (event) => { event.preventDefault(); if (!prompt.trim() || !answer.trim() || !distractor.trim()) return; setBank((items) => [...items, { prompt: prompt.trim(), answer: answer.trim(), options: [answer.trim(), distractor.trim(), "None of these", "All of these"].sort(() => Math.random() - 0.5) }]); setPrompt(""); setAnswer(""); setDistractor(""); };
    return <section className={styles.quizPracticeBuilder} id="dashboard">
        <header className={styles.top}><div><p className={styles.label}>PRACTICE ROOM / WEB BASICS</p><h1>Learn by trying.</h1><p>Quick rounds, clear feedback, and questions you can make your own.</p></div><div className={styles.scoreBadge}><span>YOUR BANK</span><b>{bank.length}</b><small>questions</small></div></header>
        <div className={styles.layout} id="workspace">
            <section className={styles.quizPanel}><div className={styles.panelTop}><span>01</span><div><b>Web foundations</b><small>{bank.length} questions · self-paced</small></div><span className={styles.difficulty}>QUICK MIX</span></div>
                {phase === "ready" && <div className={styles.ready}><span className={styles.bigIcon}>Q</span><p className={styles.label}>READY WHEN YOU ARE</p><h2>A little practice goes a long way.</h2><p>Answer a short set of {bank.length} multiple-choice questions and see your score at the end.</p><button type="button" onClick={start}>Start a round <FiArrowRight /></button></div>}
                {phase === "playing" && <div className={styles.question}><div className={styles.questionMeta}>QUESTION {index + 1} <span>/ {bank.length}</span><div><i style={{ width: ((index + 1) / bank.length * 100) + "%" }} /></div></div><h2>{bank[index].prompt}</h2><div className={styles.options}>{bank[index].options.map((option, number) => <button type="button" key={option} className={choice === option ? styles.selected : ""} onClick={() => setChoice(option)}><span>{String.fromCharCode(65 + number)}</span>{option}{choice === option && <FiCheck />}</button>)}</div><button type="button" className={styles.nextButton} disabled={!choice} onClick={next}>{index + 1 === bank.length ? "See results" : "Next question"}<FiArrowRight /></button></div>}
                {phase === "result" && <div className={styles.ready}><span className={styles.bigIcon}><FiCheck /></span><p className={styles.label}>ROUND COMPLETE</p><h2>{score} out of {bank.length}</h2><p>{score === bank.length ? "A perfect round. You’ve got this material down." : "Good practice. Review the ideas you missed and try another round."}</p><button type="button" onClick={start}><FiRotateCcw /> Play again</button></div>}
            </section>
            <aside className={styles.builder}><p className={styles.label}>MAKE IT YOURS</p><h2>Build a question</h2><p className={styles.builderText}>Add a prompt to your local question bank.</p><form onSubmit={addQuestion}><label>Question<input value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="What do you want to remember?" required /></label><label>Correct answer<input value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="The right answer" required /></label><label>One distractor<input value={distractor} onChange={(e) => setDistractor(e.target.value)} placeholder="A plausible wrong answer" required /></label><button type="submit">Add to bank <FiPlus /></button></form><div className={styles.localNote}><FiCheck /> Your question bank stays in this browser.</div></aside>
        </div>
    </section>;
};
export default QuizPracticeBuilder;
