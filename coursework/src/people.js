import {createClient} from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supaBaseURL = "https://yljmvabqdbrtxgdmtkrs.supabase.co";
const supaBaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlsam12YWJxZGJydHhnZG10a3JzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU2OTMzOTEsImV4cCI6MjAzMTI2OTM5MX0.R3YGPr0iZhQRnvHVQ-SJHpYExCkzwd87aW0La7Xe7sU";
const button = document.querySelector("button");
const supabase = createClient(supaBaseURL,supaBaseKey);
const message = document.querySelector("#message");
const resultsPane = document.querySelector(".resultsPane");
let name, license, emptyName, emptyLicense;

function checkFilling(){

    name = document.querySelector("#name").value.trim();
    license = document.querySelector("#license").value.trim();  

    emptyName = (name === "");
    emptyLicense = (license === "");

    if(emptyName === emptyLicense){
        message.textContent = "Error";
        return false;
    }
    
    return true;
}

function checkMatch(x){

    if(x.Name.toLowerCase() === name.toLowerCase()){
        return true;
    }
    else if(x.LicenseNumber === license){
        return true;
    }
    else{
        const names = x.Name.toLowerCase().split(" ");
        for(let n of names){
            if(n === name.toLowerCase()){
                return true;
            }
        }
    }

    return false;
}

async function search(){

    const {data, error} = await supabase
        .from("People")
        .select();

    if(error){
        message.textContent = error.message;
        return;
    }
    else{

        resultsPane.innerHTML = "";

        let found = false;

        for(let x of data){
            if(checkMatch(x)){

                found = true;
                message.textContent = "Search successful";

                const textArea =document.createElement("div");
                textArea.className = "search_result"

                let resultsHTML = "";
                Object.entries(x).forEach(([key,value]) => {
                    const entry = `<strong>${key}: </strong>${value}`;
                    resultsHTML += `${entry}<br>`;
                });
                
                textArea.innerHTML = resultsHTML;

                resultsPane.appendChild(textArea);
             
            }
        }

        if(!found){
            message.textContent = "No result found";
        }
    }

}

button.addEventListener("click",() => {

    if(!checkFilling()){
        return;
    }

    search();

})