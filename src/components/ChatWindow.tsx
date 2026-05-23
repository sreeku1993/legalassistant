"use client";
import ReactMarkdown from "react-markdown";
import { useState } from "react";

type Source = {
  title: string;
  category: string;
  documentType: string;
};

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatWindow() {

  const [input,setInput] =
    useState("");

  const [loading,setLoading] =
    useState(false);

  const [messages,setMessages] =
    useState<Message[]>([]);

  const [sources,setSources] =
    useState<Source[]>([]);

  async function sendMessage() {

    if(!input.trim()) return;

    const userMessage = input;

    setMessages(prev=>[
      ...prev,
      {
        role:"user",
        content:userMessage
      }
    ]);

    setInput("");
    setLoading(true);

    try{

      const response =
        await fetch(
          "/api/chat",
          {
            method:"POST",
            headers:{
              "Content-Type":
              "application/json"
            },
            body:JSON.stringify({
              message:userMessage
            })
          }
        );

      const data =
        await response.json();

      setMessages(prev=>[
        ...prev,
        {
          role:"assistant",
          content:data.answer
        }
      ]);

      setSources(
        data.sources || []
      );

    } catch(err){

      console.error(err);

    } finally {

      setLoading(false);
    }
  }

  return (

<div className="h-screen bg-black text-white flex">

{/* Sidebar */}

<div className="
w-[260px]
border-r
border-white/10
p-5
">

<div className="
text-2xl
font-bold
mb-8
">
⚖ AI Gumasthan
</div>

<button
className="
w-full
rounded-xl
bg-white/10
p-3
hover:bg-white/20
transition
"
onClick={()=>{
setMessages([]);
setSources([]);
}}
>

+ New Chat

</button>

</div>

{/* Main Chat */}

<div className="
flex-1
flex
flex-col
">

<div className="
flex-1
overflow-y-auto
p-8
space-y-6
">

{messages.length===0 && (

<div className="
h-full
flex
items-center
justify-center
text-center
opacity-60
">

<div>

<div className="
text-4xl
mb-3
">
⚖
</div>

<div className="
text-2xl
font-semibold
mb-2
">
NyayaAI
</div>

<div>
Ask questions about Indian law
</div>

</div>

</div>

)}

{messages.map(
(message,index)=>(

<div
key={index}
className={`
max-w-[75%]
rounded-2xl
p-4
whitespace-pre-wrap

${message.role==="user"
?"ml-auto bg-blue-600"
:"bg-white/10"}
`}
>

<ReactMarkdown
components={{
h1:({children})=>(
<h1 className="
text-2xl
font-bold
mb-4
">
{children}
</h1>
),

h2:({children})=>(
<h2 className="
text-xl
font-semibold
mb-3
mt-4
">
{children}
</h2>
),

ul:({children})=>(
<ul className="
list-disc
ml-6
space-y-2
">
{children}
</ul>
),

ol:({children})=>(
<ol className="
list-decimal
ml-6
space-y-2
">
{children}
</ol>
),

strong:({children})=>(
<strong className="
font-bold
">
{children}
</strong>
),

p:({children})=>(
<p className="
mb-3
leading-7
">
{children}
</p>
)
}}
>

{message.content}

</ReactMarkdown>

</div>

)
)}

{loading && (

<div
className="
bg-white/10
rounded-2xl
p-4
w-fit
"
>

Thinking...

</div>

)}

</div>

<div
className="
border-t
border-white/10
p-6
"
>

<div className="
flex
gap-4
">

<input
value={input}
onChange={(e)=>
setInput(
e.target.value
)
}
onKeyDown={(e)=>{
if(
e.key==="Enter"
){
sendMessage();
}
}}
placeholder="
Ask about Indian law..."
className="
flex-1
bg-white/5
border
border-white/10
rounded-xl
p-4
outline-none
"
/>

<button
onClick={
sendMessage
}
disabled={
loading
}
className="
px-6
rounded-xl
bg-white
text-black
font-medium
"
>

Send

</button>

</div>

</div>

</div>

{/* Sources */}

<div className="
w-[320px]
border-l
border-white/10
p-6
">

<div className="
font-semibold
mb-5
">
Sources
</div>

<div className="
space-y-3
">

{[
...new Map(
sources.map(
s => [s.title,s]
)
).values()
].map(
(source,index)=>(

<div
key={index}
className="
rounded-xl
bg-white/5
p-4
"
>

<div className="
font-medium
">
{source.title}
</div>

<div className="
text-sm
opacity-60
mt-1
">
{source.category}
</div>

</div>

)
)}

</div>

</div>

</div>

  );
}