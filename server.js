
const express=require('express');
const bodyParser=require('body-parser');
const cors=require('cors');
const app=express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));

require('dotenv').config();
const {OpenAI} =require('langchain/llms/openai');
//const{BufferMemory}=require('langchain/memory')
//const {ConversationChain}=require('langchain/chains')
const {initializeAgentExecutorWithOptions} =require('langchain/agents')

const {SerpAPI}=require('langchain/tools');
const {Calculator} =require('langchain/tools/calculator');
const key=process.env.KEY;
const skey=process.env.SKEY;
const model=new OpenAI({openAIApiKey:key,temperature:0.9});
//const memory=new BufferMemory();
/*const chain=new ConversationChain({llm:model,memory:memory })
const chat=new OpenAI({
    
    streaming:true,
    openAIApiKey:key,
    callbacks:[
        {
            handleLLMNewToken(token){
                process.stdout.write(token);
            },

        },
      
    ],
})
*/
const tools=[
    new SerpAPI(skey,{
        
        location: "Austin,Texas,United States",
        hl: "en",
        gl: "us",
    }),
    new Calculator(),
];


app.post('/ques',async(req,res)=>{

    const input=req.body.input;
   // console.log(input);
    const executor=await initializeAgentExecutorWithOptions(tools,model,{
    
        agentType:"zero-shot-react-description",

    });
    const result = await executor.call({ input });
    //console.log(result);
    res.send(result);
    

      
})
/*
const pro=async()=>{
    const executor=await initializeAgentExecutorWithOptions(tools,model,{
        agentType:"zero-shot-react-description",
    });
    
    /*console.log("Loaded agent");
    const input=  "Who is Olivia Wilde's boyfriend?" +
    " What is his current age raised to the 0.23 power?";

  const result = await executor.call({ input });
  const reply=await chain.call({input:"hi!I am palak"});
  console.log(reply)
console.log({result})
  const check=await chain.call({input:"what is my name AI"});
  console.log({check});
  
  const input="tell me about ai?";

  const repll=await chat.call(input);
  console.log(repll);

}
*/

app.listen(5000,()=>{
    console.log("listening to port 5000");

});