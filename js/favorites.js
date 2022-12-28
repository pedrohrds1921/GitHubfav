import {GithubServer} from "./GithubServer.js"


export class Favorites{
    constructor(app){
        this.app=document.querySelector(app)
        this.loadUsers()
    }
    loadUsers() {

        this.usersList=JSON.parse(localStorage.getItem('@github-favorites:'))|| []
       
        
    }
    save(){
        localStorage.setItem('@github-favorites:',JSON.stringify(this.usersList))
    }
    delete(user){
        const usersSelected=this.usersList.filter(delectUser=> delectUser.login!==user.login)

        this.usersList=usersSelected
       
        this.updateView()
        this.save()
    }  

    async add(username){
        console.log (username)
        try{

            const userExists=this.usersList.find(userWanted=>userWanted.login==username)
            if(userExists){

                throw new Error(`Usuario ${username} ja Listado`)
            }

        const user = await GithubServer.search(username)

        if(user.login===undefined){
                throw new Error(`Usuario ${username} não encontrado`)
            }

        this.usersList= [user,...this.usersList]
    
        this.updateView()
        this.save()

    }catch(error){
        alert(error.message)
    }

}
}
export class FavoritesView extends Favorites{
    constructor(app){
        super(app)
        this.tbody= this.app.querySelector('table tbody')
        this.updateView()
        this.addNewUser()
    }
        updateView(){
            const emptyFav= this.app.querySelector('.inner') 
            if(this.usersList.length<=0){
                emptyFav.style.display="flex"
            }else{
                emptyFav.style.display="none" 
            }
        this.removeTableRow()

        this.usersList.forEach(user=>{
            const row=this.createRow()

            row.querySelector('.user img').src=`https://github.com/${user.login}.png`
            row.querySelector('.user img').alt=`Imagem de ${user.name}`
            row.querySelector('.user a p').textContent=user.name
            row.querySelector('.user a').href=`https://github.com/${user.login}`
            row.querySelector('.user a span').textContent=user.login
            row.querySelector('.public_repos').textContent=user.public_repos
            row.querySelector('.followers').textContent=user.followers

            row.querySelector('td button').onclick=()=>{
                const isOK=confirm(`Voce realmente que deletar o ${user.name}?`)
                if(isOK){
                    this.delete(user)
                }
            }

            this.tbody.append(row)

        

        })
        
    }
    removeTableRow(){
        this.tbody.querySelectorAll(`tr`).forEach(tr => tr.remove())
        
        
    }


    createRow(){
        const tr= document.createElement("tr")
        tr.innerHTML=`
        <td class="user">
            <img src="https://github.com/Pedrohrds1921.png" alt="">
            <a href="" target="blank">
                <p>Pedro Henrique Rodrigues</p>
                <span>/Pedrohrds1921</span>
            </a>
        </td>
        <td class="public_repos">
            <p>123</p>
        </td>
        <td class="followers">
            <p>123</p>
        </td>
        <td class="actionBtn">
            <button>
                Remover
            </button>
        </td>`
    return tr
    }

    addNewUser(){
        const addButton= this.app.querySelector('.search button')
            addButton.onclick= ()=>{
                
                const { value }= this.app.querySelector('.search input')
                if(value ===""){
                   alert(`Digite o username do gitbub para favoritar`)
                  return
                  
                }

               
                this.add(value)
        
            }
}}