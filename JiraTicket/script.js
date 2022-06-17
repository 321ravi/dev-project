let addbtn = document.querySelector('.add-btn');
let removebtn = document.querySelector('.remove-btn')
let modalcont= document.querySelector('.modal-cont')
let maincont = document.querySelector('.main-cont')
let textcont = document.querySelector('.text-cont')
let allprioritycolor = document.querySelectorAll('.priority-color')
let toolboxcolor = document.querySelectorAll('.color')


let colors = ["lightpink","lightblue","lightgreen","black"];
let modalprioritycolor = colors[colors.length-1];

let addflag = false;
let removeflag = false;

let lock = "fa-lock";
let unlock = "fa-lock-open";

// creation of array

let ticketarr = [];
 

if(localStorage.getItem("jira_tickets"))
{
    ticketarr =JSON.parse(localStorage.getItem("jira_tickets"));
    ticketarr.forEach((ticketObj) =>{
        createTicket(ticketObj.ticketcolor,ticketObj.ticketTask,ticketObj.ticketId);
    })
}
// finding currentcolor in toolbox
 for(let i =0;i<toolboxcolor.length;i++)
 {
    toolboxcolor[i].addEventListener("click",(e) =>{

        let currentToolboxcolor = toolboxcolor[i].classList[0]

        let filterticket = ticketarr.filter((ticketObj,idx) =>{
            
                return currentToolboxcolor === ticketObj.ticketcolor;
        })
            
            // remove all ticket
            let allTicketcont = document.querySelectorAll(".ticket-cont");
            for(let i =0;i<allTicketcont.length;i++)
            {
                allTicketcont[i].remove();
            }

            // display filtered ticket
            filterticket.forEach((ticketObj,idx) => {
                createTicket(ticketObj.ticketcolor,ticketObj.ticketTask,ticketObj.ticketId);
            })
          
            
            toolboxcolor[i].addEventListener("dblclick",(e) =>{
                 
                // remove all filtered ticket
                let allTicketcont = document.querySelectorAll(".ticket-cont");
                for(let i =0;i<allTicketcont.length;i++)
                {
                    allTicketcont[i].remove();
                }
               
                // display all ticket
                ticketarr.forEach((ticketObj,idx) =>{
                    createTicket(ticketObj.ticketcolor,ticketObj.ticketTask,ticketObj.ticketId);      

                })

            })

    })
 }

allprioritycolor.forEach((colorElem, idx) =>{

    colorElem.addEventListener("click", (e) =>{

       allprioritycolor.forEach((prioritycol, idx)=>{

           prioritycol.classList.remove("border");

       })   

       colorElem.classList.add("border");
       modalprioritycolor= colorElem.classList[0];
   
   })

})


  addbtn.addEventListener("click",(e) =>{

    // addflag:true display modal
    // addflag:false model none

    addflag = !addflag;
    if(addflag)
    {
        modalcont.style.display="flex";
    }

    else
    {
        modalcont.style.display="none";
    }
   
})

removebtn.addEventListener('click',(e) =>{

    removeflag=!removeflag;
})





modalcont.addEventListener("keydown", (e) =>{
 
    let key = e.key;
       if(key == "Shift")
      {
         createTicket(modalprioritycolor,textcont.value);
         modalcont.style.display="none";
         textcont.value="";
        addflag=false;
         modaldeafault();
      }

})
// creation of ticket
function createTicket(ticketcolor,ticketTask,ticketId)
{

    let id = ticketId || shortid();
    let ticketcont = document.createElement("div");
    ticketcont.setAttribute("class","ticket-cont");

    ticketcont.innerHTML =`

             <div class="ticket-color ${ticketcolor}"></div>
              <div class="ticket-id">#${id}</div>
              <div class="task-area">
                ${ticketTask}
              </div>
            <div class="ticket-lock">
            <i class="fa-solid fa-lock"></i>
            </div>


              `;

              maincont.appendChild(ticketcont);
        

            // create object of ticket and add to array;
            if(!ticketId)
            {
             ticketarr.push({ticketcolor,ticketTask,ticketId:id});
             // all data push to local storage 
             localStorage.setItem("jira_tickets",JSON.stringify(ticketarr));
            }
            // this all functionality applied on ticket
            handleremoval(ticketcont,id);
              handlelock(ticketcont,id);
              handlecolor(ticketcont,id);
             
}

 

function  handleremoval(ticket,id)
{
     ticket.addEventListener("click",(e) =>{

           if(!removeflag) return;

           let idx = getticketidx(id);

           //db removal
           ticketarr.splice(idx,1)
           let strticketarr = JSON.stringify(ticketarr);
           localStorage.setItem("jira_tickets",strticketarr);

           //ui removal
           ticket.remove();

     })
     
}
  

// this is the function to handle lock and unlock for editing task
function handlelock(ticket,id)
{
    let ticketlockelem = ticket.querySelector('.ticket-lock')
    let ticketlock = ticketlockelem.children[0];
    let tickettaskarea = ticket.querySelector('.task-area')
    ticketlock.addEventListener("click",(e) =>{
          
        let ticketidx = getticketidx(id);
        if(ticketlock.classList.contains(lock))

        {
              ticketlock.classList.remove(lock);
              ticketlock.classList.add(unlock);
              tickettaskarea.setAttribute("contenteditable","true");
        }

        else{
            ticketlock.classList.remove(unlock);
            ticketlock.classList.add(lock);
            tickettaskarea.setAttribute("contenteditable","false");
        }
         //  modify data in local storage of ticket task
          ticketarr[ticketidx].ticketTask=tickettaskarea.innerText;
          localStorage.setItem("jira_tickets",JSON.stringify(ticketarr));
    })
}

// this is the function to 
function handlecolor(ticket,id)
{
    let ticketcolor = ticket.querySelector('.ticket-color');
        ticketcolor.addEventListener("click",(e) =>{
            
            // getting index of ticket to change color
            let ticketidx = getticketidx(id);
        
    let currticketcolor = ticketcolor.classList[1];

  let currentidx =  colors.findIndex((color) =>{
      
         return currticketcolor === color;
    })

    currentidx++;
    let newTicketcoloridx = currentidx%colors.length;

    let newticketcolor = colors[newTicketcoloridx];

    ticketcolor.classList.remove(currticketcolor);
 
    ticketcolor.classList.add(newticketcolor);
 
     // modify data in storage
     ticketarr[ticketidx].ticketcolor= newticketcolor;
     localStorage.setItem("jira_tickets",JSON.stringify(ticketarr));
})
}

// through this function we are getting ticket which we want to change
function getticketidx(id)
{
      let ticketidx = ticketarr.findIndex((ticketObj)=>{

        return ticketObj.ticketId===id;
      })

      return ticketidx;
}


function modaldeafault()
{

    modalprioritycolor = colors[colors.length-1];
    allprioritycolor.forEach((prioritycol, idx)=>{

        prioritycol.classList.remove("border");

    })   

    allprioritycolor[allprioritycolor.length-1].classList.add("border");
}