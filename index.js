const saveButton = document.querySelector(".btn")
const nameInput = document.getElementById("name")
const loginInfo = document.getElementById("name_info")
const blogInfo = document.getElementById("blog")
const locationInfo = document.getElementById("location")
const languageInfo = document.getElementById("language")
const bioInfo = document.querySelector(".bio")
const alertElement = document.querySelector(".alert")
const alertElement2 = document.querySelector(".alert2")
const imageInfo = document.querySelector(".image")


async function btnSubmit(e){
    e.preventDefault();
    let checker = true
    let userLanguage = ''
    const map1 = new Map();
    let obj
    const inputName = nameInput.value
    // use localStorage if item exists
    if (window.localStorage.getItem(inputName)) {
        console.log("localStorage")
        obj = JSON.parse(window.localStorage.getItem(inputName))
        alertElement2.innerHTML = "load from storage"
        alertElement2.classList.remove("hide")
    }
    // use fetch if item doesnt exist on lcoalStorage
    else{
        alertElement2.classList.add("hide")
        console.log("fetch")
        try{
            let response = await fetch(`https://api.github.com/users/${inputName}`);
            let status = response.status
            obj = await response.json();
            // console.log(obj)
            if (status === 200){
                // fetch to get user programming language
                let response2 = await fetch(obj.repos_url);
                let status2 = response2.status
                let repo = await response2.json();
                if(status2 === 200){
                    // set user language 
                    let len = Object.keys(repo).length
                    if (Object.keys(repo).length > 5){
                        len = 5
                    }
                    if (Object.keys(repo).length == 0){
                        len = 0
                    }
                    for (let i = 0; i < len; i++){
                        if (! map1.has(repo[i].language) && repo[i].language !== null){
                            map1.set(repo[i].language, 1)
                        }
                        else{
                            if (repo[i].language !== null){
                                map1.set(repo[i].language, map1.get(repo[i].language) + 1)
                            } 
                        }
                    }
                    let size = 1
                    if (Object.keys(repo).length !== 0){
                        userLanguage = repo[0].language
                    }
                    map1.forEach((value, key) => {
                        if (value >= size){
                            size = value
                            userLanguage = key
                        }
                        // console.log(`${key} = ${value}`);
                    });
                    // console.log(userLanguage)
                    languageInfo.innerHTML = userLanguage
                    obj.userLanguage = userLanguage
                    languageInfo.classList.remove('hide')
                    // creating new object to save it on localStorage
                    const storageObj = {
                        name: obj.name,
                        blog: obj.blog,
                        location: obj.location,
                        bio: obj.bio,
                        avatar_url: obj.avatar_url,
                        userLanguage: userLanguage
                    }
                    window.localStorage.setItem(inputName , JSON.stringify(storageObj))
                }
                
            }
            // invalid user 
            if (status === 404){
                checker = false
                alertElement.innerHTML = "invalid user"
                alertElement.classList.remove("hide")
                loginInfo.classList.add('hide')
                blogInfo.classList.add('hide')
                locationInfo.classList.add('hide')
                bioInfo.classList.add('hide')
                languageInfo.classList.add('hide')
                imageInfo.setAttribute("src", "./images/download.png")
            }
         }
        //  network error
         catch(e){
            console.log(e)
            alertElement.classList.remove("hide")
            alertElement.innerHTML = "Network Error"
            return
         }
    }
    // display user info 
    if(checker){
        // console.log(obj)
        alertElement.classList.add("hide")
        imageInfo.setAttribute("src", obj.avatar_url)
        if (obj.name !== null){
            loginInfo.innerHTML = obj.name
            loginInfo.classList.remove('hide')
        }
        else{
            loginInfo.innerHTML = ""
            loginInfo.classList.add('hide')
        }
        if (obj.blog !== ""){
            blogInfo.innerHTML = obj.blog
            blogInfo.classList.remove('hide')
        }
        else{
            blogInfo.innerHTML = ""
            blogInfo.classList.add('hide')
        }
        if (obj.location !== null){
            locationInfo.innerHTML = obj.location
            locationInfo.classList.remove('hide')
        }
        else{
            locationInfo.innerHTML = ""
            locationInfo.classList.add('hide')
        }
        if (obj.userLanguage !== null){
            languageInfo.innerHTML = obj.userLanguage
            languageInfo.classList.remove('hide')
        }
        else{
            languageInfo.innerHTML = ""
            languageInfo.classList.add('hide')
        }
        if (obj.bio !== null){
            // /r/n handling
            let output = ``
            let str = obj.bio
            const arr = str.split(/\r?\n|\r|\n/g)
            arr.map((e) => {
                output = output + e + `<br />`
            })
            bioInfo.innerHTML = output
            bioInfo.classList.remove('hide')
        }
        else{
            bioInfo.innerHTML = ""
            bioInfo.classList.add('hide')
        }
    }
}

saveButton.addEventListener('click', btnSubmit)
