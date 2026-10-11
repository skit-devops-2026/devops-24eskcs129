function tohome(){
    window.location.href="main.html";
}

function profile(){
    let profile=document.getElementById("profileCard");
    if(profile.style.display==="block"){
        profile.style.display="none";
    }else{
        profile.style.display="block";
    }
}

function toggleProfile(){
    profile();
}

function toimportant(){
    window.location.href="important.html";
}

function toggleImportant(button){
    let card=button.closest(".note-card");
    let noteId=card.id;
    let icon=button.querySelector("i");
    let importantNotes=JSON.parse(localStorage.getItem("importantNotes"))||[];

    if(icon.classList.contains("fa-regular")){
        icon.classList.remove("fa-regular");
        icon.classList.add("fa-solid");
        icon.style.color="rgb(109,192,105)";
        if(!importantNotes.includes(noteId)){
            importantNotes.push(noteId);
        }
    }else{
        icon.classList.remove("fa-solid");
        icon.classList.add("fa-regular");
        icon.style.color="rgb(15,212,4)";
        importantNotes=importantNotes.filter(id=>id!==noteId);
    }

    localStorage.setItem("importantNotes",JSON.stringify(importantNotes));
}

function logout(){
    let confirmLogout=confirm("Are you sure you want to logout?");
    if(confirmLogout){
        window.location.href="login.html";
    }
}