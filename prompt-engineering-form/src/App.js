import { useState } from "react";

export default function PromptEngineeringForm() {
  const [goal, setGoal] = useState("");
  const [role, setRole] = useState("");
  const [context, setContext] = useState("");
  const [format, setFormat] = useState("");
  const [style, setStyle] = useState("");
  const [output, setOutput] = useState("");

  const handleSubmit = () => {
    const prompt = `
[GOAL]  
Your task is to: ${goal}

[ROLE]  
Act as a ${role}.

[CONTEXT]  
Here is background you should incorporate:  
${context}

[FORMAT]  
Return your response in the following format:  
${format}

[STYLE]  
Write with a tone that is ${style}. Prioritize: clarity, insight density, and precision.

[INSTRUCTIONS]  
Before you begin:
- Think step by step if reasoning is involved.
- Clarify any ambiguous assumptions.
- If input is incomplete, infer based on prior patterns.

Now begin.`;
    setOutput(prompt);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Prompt Engineering Form</h1>

      <div className="grid gap-4">
        <textarea className="w-full border rounded p-2" rows={3} placeholder="Define your goal..." value={goal} onChange={(e) => setGoal(e.target.value)} />
        <input className="w-full border rounded p-2" type="text" placeholder="Define role (e.g., AI strategist, fitness coach)..." value={role} onChange={(e) => setRole(e.target.value)} />
        <textarea className="w-full border rounded p-2" rows={3} placeholder="Provide relevant context..." value={context} onChange={(e) => setContext(e.target.value)} />
        <textarea className="w-full border rounded p-2" rows={2} placeholder="Specify desired output format..." value={format} onChange={(e) => setFormat(e.target.value)} />
        <input className="w-full border rounded p-2" type="text" placeholder="Style (e.g., direct, analytical)..." value={style} onChange={(e) => setStyle(e.target.value)} />
        <button className="bg-black text-white px-4 py-2 rounded" onClick={handleSubmit}>Generate Prompt</button>
      </div>

      {output && (
        <div className="mt-6 border rounded p-4 bg-gray-100 whitespace-pre-wrap">
          <h2 className="text-xl font-semibold mb-2">Generated Prompt</h2>
          {output}
        </div>
      )}
    </div>
  );
}
