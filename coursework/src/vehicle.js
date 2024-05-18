import {createClient} from
'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supaBaseURL = "https://yljmvabqdbrtxgdmtkrs.supabase.co";
const supaBaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlsam12YWJxZGJydHhnZG10a3JzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU2OTMzOTEsImV4cCI6MjAzMTI2OTM5MX0.R3YGPr0iZhQRnvHVQ-SJHpYExCkzwd87aW0La7Xe7sU";
const button = document.querySelector("#submitButton");
const supabase = createClient(supaBaseURL,supaBaseKey);
const message = document.querySelector("#message");
const resultsPane = document.querySelector("#results");
let rego;

function checkMatch(x){
    if(x.VehicleID === rego){
        return true;
    }
    else{
        return false;
    }

}


async function search() {
    
    const {data , error} = await supabase
        .from("Vehicles")
        .select();

    if(error){
        message.textContent = error.message;
        return;
    }
    else{
        
        let found = false;
        resultsPane.innerHTML = "";

        for(let x of data){
            if(checkMatch(x)){
                found = true;

                message.textContent = "Search successful";

                const resultsText = document.createElement("div");
                resultsText.className = "search_resultV";

                let resultsHTML = "";
                Object.entries(x).forEach(([key,value]) => {
                    const entry = `<strong>${key}: </strong>${value}`;
                    resultsHTML += `${entry}<br>`;
                })

                resultsText.innerHTML = resultsHTML;

                resultsPane.appendChild(resultsText);


            }

        }

        if(!found){
            message.textContent = "No result found";
        }

    }

}

button.addEventListener("click", () => {
    
    rego = document.querySelector("#rego").value;

    if(rego === ""){
        message.textContent = "Error";
        return;
    }

    search();


} )

