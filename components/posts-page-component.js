import { user, posts, goToPage } from "../index.js";
import { renderHeaderComponent } from "./header-component.js";
import { AUTH_PAGE, USER_POSTS_PAGE } from "../routes.js";
import { loginedUserPosts, userPostsId} from "./add-post-page-component.js";
let userPostId;





export function renderPostsPageComponent({ appEl }) {
  // TODO: реализовать рендер постов из api
  console.log("Актуальный список постов:", posts);
  /**
   * TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
   * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
   */
  //страница всех постов
  const appHtml = posts.map((i, index)=>{
    let likesAr = ([] = i.likes);
    let likesName =[];
    userPostId = i.user.id;
    for (let index = 0; index < likesAr.length; index++) {
    likesName.push(` ${likesAr[index].name}`);
    }
    return `<div class="page-container" id ="page-container-id">
      <div class="header-container" ></div>
        <ul class="posts"id ="posts-id">
        <li class="post" id ="post-id">
        <div class="post-header" data-user-id="${i.user.id}">
        <img src="${i.user.imageUrl}" class="post-header__user-image">
        <p class="post-header__user-name">${i.user.name}</p>
        </div>
        <div class="post-image-container">
        <img class="post-image" src="${i.imageUrl}">
        </div>
        <div class="post-likes">
      <button data-post-id="${i.id}" class="like-button">
      <img id="like-on" src="${
        i.isLiked === true
          ? "./assets/images/like-active.svg"
          : "./assets/images/like-not-active.svg"
      }">
  </button>
        <p class="post-likes-text" id ="likes-number-id">
        Нравится: <strong>${i.likes.length}</strong>
                </p>
        </div>
        <p class="post-text">
        <span class="user-name">${likesName}</span>
      ${i.description}
        </p>
        <p class="post-date">
          ${i.createdAt}
        </p>
          </li>
          </ul>
            </div>`
                  
  })
  appEl.innerHTML = appHtml;
  
  likePost();//подключение лайков
  renderHeaderComponent({
    
    element: document.querySelector(".header-container"),
  });
userPageOpen(appEl);//подключение перехода на страницу постов пользователя
}
export function likePost(){
  const likePost = document.querySelectorAll('.like-button')
  for (const likeEl of likePost) {
    
    let post = posts.filter((item)=>
    item.id === likeEl.dataset.postId)
    
    likeEl.addEventListener("click", () => {      
      if (user === null) {
        alert(`Для простановки лайков нужно зайти в приложение!`);
        goToPage(AUTH_PAGE);
      }
      if (post[0].isLiked === true) {
        return fetch(`https://wedev-api.sky.pro/api/v1/egor_torg/instapro/user-posts/${likeEl.dataset.postId}/dislike`, {
        method: "POST",
        headers: { Authorization: `Bearer ${user.token}` },
        }).then((response)=>{
          return response.json()
        }).then((data) => {
          console.log(data)
          return fetch(`https://wedev-api.sky.pro/api/v1/egor_torg/instapro/user-posts/`,{
          method: "GET",
          headers: { Authorization: `Bearer ${user.token}` }, 
        }).then((response)=>response.json()).then((data)=>{
          let likeData =data;
          
        //re render pge posts
        reRenderPosts(likeData)
        return likeData
      })})}
          
      return fetch(`https://wedev-api.sky.pro/api/v1/egor_torg/instapro/user-posts/${likeEl.dataset.postId}/like`, {
        method: "POST",
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        return fetch(`https://wedev-api.sky.pro/api/v1/egor_torg/instapro/user-posts/`,{
          method: "GET",
          headers: { Authorization: `Bearer ${user.token}` }, 
        }).then((response) => {return response.json()})
        .then((data) => {
          let likeData = data;
          //rerender pge posts
          reRenderPosts(likeData)
          return likeData;
        })
      })
    })}
    }

    export function reRenderPosts(likeData){
    let newArr =[] 
    newArr=likeData.posts
    let postPage = document.getElementById('app')
        
    console.log(postPage.innerHTML);
    postPage.innerHTML= newArr.map((i,index)=>{
      let likesAr =([] = i.likes);
      let likesName =[];
      for (let index = 0; index < likesAr.length; index++) 
      {
      likesName.push(` ${likesAr[index].name}`)
      } 
//render posts page new
return `<div class="page-container" id ="page-container-id">
<div class="header-container" ></div>
<ul class="posts"id ="posts-id">
<li class="post" id ="post-id">
<div class="post-header" data-user-id="${i.user.id}">
<img src="${i.user.imageUrl}" class="post-header__user-image">
<p class="post-header__user-name">${i.user.name}</p>
</div>
<div class="post-image-container">
<img class="post-image" src="${i.imageUrl}">
</div>
<div class="post-likes">
<button data-post-id="${i.id}" class="like-button">
<img id="like-on"  src="${
  i.isLiked === true
    ? "./assets/images/like-active.svg"
    : "./assets/images/like-not-active.svg"
}">
</button>
<p class="post-likes-text" id ="likes-number-id">
Нравится: <strong>${i.likes.length}</strong>
</p>
</div>
<p class="post-text">
<span class="user-name">${likesName}</span>
${i.description}
</p>
<p class="post-date">
${i.createdAt}
</p>
</li>
</ul>
</div>`
    });
// переход на  страницу пользователя после пересоздания страницы
    for (let userEl of document.querySelectorAll(".post-header")) {
      userEl.addEventListener("click", () => {
        
        let userPosts=[]
    return fetch(`https://wedev-api.sky.pro/api/v1/egor_torg/instapro/user-posts/${userEl.dataset.userId}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${user.token}` },
            }).then((response)=>{
              return response.json()})
              .then((data)=>{
                userPosts=data.posts;
                let postPage = document.getElementById('app');
                postPage.innerHTML= userPosts.map((i,index)=>{
                  let likesAr =([] = i.likes)
                  let likesName =[];
                  for (let index = 0; index < likesAr.length; index++) 
                  {
                  likesName.push(` ${likesAr[index].name}`)
                  } 
            //render posts page new
            return `<div class="page-container" id ="page-container-id">
            <div class="header-container" ></div>
            <ul class="posts"id ="posts-id">
            <li class="post" id ="post-id">
            <div class="post-header" data-user-id="${i.user.id}">
            <img src="${i.user.imageUrl}" class="post-header__user-image">
            <p class="post-header__user-name">${i.user.name}</p>
            </div>
            <div class="post-image-container">
            <img class="post-image" src="${i.imageUrl}">
            </div>
            <div class="post-likes">
            <button data-post-id="${i.id}" class="like-button">
            <img src="${
              i.isLiked === true
                ? "./assets/images/like-active.svg"
                : "./assets/images/like-not-active.svg"
            }">
            </button>
            <p class="post-likes-text" id ="likes-number-id">
            Нравится: <strong>${i.likes.length}</strong>
            </p>
            </div>
            <p class="post-text">
            <span class="user-name">${likesName}</span>
            ${i.description}
            </p>
            <p class="post-date">
            ${i.createdAt}
            </p>
            </li>
            </ul>
            </div>`
                })
              }).catch((err)=>{alert(`${err.message}`)})
      }) }
    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });
    console.log(postPage.innerHTML)

      const likePost = document.querySelectorAll('.like-button')
        for (const likeEl of likePost) {
          
          let post = newArr.filter((item)=>
          item.id===likeEl.dataset.postId)
          
          likeEl.addEventListener("click", () => { 
            console.log (post[0])     
            if(post[0].isLiked===true){
            
              return fetch(`https://wedev-api.sky.pro/api/v1/egor_torg/instapro/user-posts/${likeEl.dataset.postId}/dislike`, {
              method: "POST",
              headers: { Authorization: `Bearer ${user.token}` },
              }).then((response)=>{
                return response.json();
              }).then((data) => {
                console.log(`dislike -${data}`)
                return fetch(`https://wedev-api.sky.pro/api/v1/egor_torg/instapro/user-posts/`,{
                method: "GET",
                headers: { Authorization: `Bearer ${user.token}` }, 
              }).then((response)=>response.json()).then((data)=>{
                let likeData = data;
                // goToPage(USER_POSTS_PAGE)
              reRenderPosts(likeData);
              return likeData
            }).catch((err)=>{alert(`${err.message}`)})
                
            }).catch((err)=>{alert(`${err.message}`)})
            }
            
            return fetch(`https://wedev-api.sky.pro/api/v1/egor_torg/instapro/user-posts/${likeEl.dataset.postId}/like`, {
              method: "POST",
              headers: { Authorization: `Bearer ${user.token}` },
              
            }).then((response) => {
              return response.json()
            }).then((data) => {
              console.log(`like -${data}`)
              return fetch(`https://wedev-api.sky.pro/api/v1/egor_torg/instapro/user-posts/`,{
                method: "GET",
                headers: { Authorization: `Bearer ${user.token}` }, 
              }).then((response)=>response.json()).then((data)=>{
                let likeData =data
                goToPage(USER_POSTS_PAGE)
              
              return likeData
              }).catch((err)=>{alert(`${err.message}`)})
      
      
            }).catch((err)=>{alert(`${err.message}`)})
            
          })}
    
              
  }
  //функция создания страницы постов пользователя
  export function userPageOpen(appEl) {
    for (let userEl of document.querySelectorAll(".post-header")) {
      userEl.addEventListener("click", () => {
        if (user === null) {
          let userPosts = posts.filter(
            (item) => item.user.id === userEl.dataset.userId
          );
          console.log(userEl.dataset);
          console.log(userEl.dataset.userId);
          console.log(posts);
          console.log(userPosts);
          appEl.innerHTML = userPosts.map((i) => {
            let likesAr = ([] = i.likes);
            let likesName = [];
            for (let index = 0; index < likesAr.length; index++) {
              likesName.push(` ${likesAr[index].name}`);
            }
            return `<div class="page-container" >
      <div class="header-container"></div>
      <ul class="posts">
      <li class="post"id ="page-container-id">
      <div class="post-header" data-user-id="${i.user.id}">
      <img src="${i.user.imageUrl}" class="post-header__user-image">
      <p class="post-header__user-name">${i.user.name}</p>
  </div>
  <div class="post-image-container">
    <img class="post-image" src="${i.imageUrl}">
  </div>
  <div class="post-likes">
    <button data-post-id="${i.id}" class="like-button" >
      <img src="${
        i.isLiked === true
          ? "./assets/images/like-active.svg"
          : "./assets/images/like-not-active.svg"
      }">
    </button>
    <p class="post-likes-text" id="like-count-id">
      Нравится: <strong>${i.likes.length}</strong>
    </p>
  </div>
  <p class="post-text">
    <span class="user-name">${likesName}</span>
      ${i.description}
  </p>
  <p class="post-date">
    ${i.createdAt}
  </p>
  </li>
  </ul>
  </div>`;
          });
        }else {
          let userPosts = [];
          return fetch(`https://wedev-api.sky.pro/api/v1/egor_torg/instapro/user-posts/${userEl.dataset.userId}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${user.token}` },
          }
        )
          .then((response) => {
            return response.json();
          })
          .then((responseData) => {
            userPosts = responseData.posts;
            appEl.innerHTML = userPosts.map((i) => {
              let likesAr = ([] = i.likes);
              let likesName = [];
              for (let index = 0; index < likesAr.length; index++) {
                likesName.push(` ${likesAr[index].name}`);
              }
              return `<div class="page-container" >
              <div class="header-container"></div>
              <ul class="posts">
              <li class="post"id ="page-container-id">
              <div class="post-header" data-user-id="${i.user.id}">
              <img src="${i.user.imageUrl}" class="post-header__user-image">
              <p class="post-header__user-name">${i.user.name}</p>
          </div>
          <div class="post-image-container">
            <img class="post-image" src="${i.imageUrl}">
          </div>
          <div class="post-likes">
            <button data-post-id="${i.id}" class="like-button" >
              <img src="${
                i.isLiked === true
                  ? "./assets/images/like-active.svg"
                  : "./assets/images/like-not-active.svg"
              }">
            </button>
            <p class="post-likes-text" id="like-count-id">
              Нравится: <strong>${i.likes.length}</strong>
            </p>
          </div>
          <p class="post-text">
            <span class="user-name">${likesName}</span>
              ${i.description}
          </p>
          <p class="post-date">
            ${i.createdAt}
          </p>
        </li>
        </ul>
        </div>`;
            });
          })}});}}

          return fetch(
            `https://wedev-api.sky.pro/api/v1/egor_torg/instapro/user-posts/${userEl.dataset.userId}`,
            {
              method: "GET",
              headers: { Authorization: `Bearer ${user.token}` },
            }
          )
            .then((response) => {
              return response.json();
            })

            .then((data) => {
              console.log(data);

              const likePost = document.querySelectorAll(".like-button");
              for (const likeEl of likePost) {
                let posts = data.posts;
                let post = posts.filter(
                  (item) => item.id === likeEl.dataset.postId
                );

                likeEl.addEventListener("click", () => {
                  console.log(`1111`);

                  if (user === null) {
                    alert(`Для простановки лайков нужно зайти в приложение!`);
                    goToPage(AUTH_PAGE);
                  }
                  if (post[0].isLiked === true) {
                    return fetch(
                      `https://wedev-api.sky.pro/api/v1/egor_torg/instapro/${likeEl.dataset.postId}/dislike`,
                      {
                        method: "POST",
                        headers: { Authorization: `Bearer ${user.token}` },
                      }
                    )
                      .then((response) => {
                        return response.json();
                      })
                      .then((data) => {
        console.log(`like -${data}`);
        return fetch(
          `https://wedev-api.sky.pro/api/v1/egor_torg/instapro/user-posts/${userEl.dataset.userId}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${user.token}` },
          }
        )
          .then((response) => response.json())
          .then((data) => {
            let likeData = data;
            reRenderPostsUser(data);
            return likeData;
          })
          .catch((err) => {
            alert(`${err.message}`);
          }); 
                      });
                    }
                  return fetch(
                    `https://wedev-api.sky.pro/api/v1/egor_torg/instapro/${likeEl.dataset.postId}/like`,
                    {
                      method: "POST",
                      headers: { Authorization: `Bearer ${user.token}` },
                    }
                  )
                    .then((response) => {
                      return response.json();
                    })
                    .then((data) => {
        console.log(`like -${data}`);
        return fetch(
          `https://wedev-api.sky.pro/api/v1/egor_torg/instapro/user-posts/${userEl.dataset.userId}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${user.token}` },
          }
        )
          .then((response) => response.json())
          .then((data) => {
            let likeData = data;
            reRenderPostsUser(data);
            return likeData;
          })
          .catch((err) => {
            alert(`${err.message}`);
          });
                    });
                });
              }
              return data.posts;
            })
export function reRenderPostsUser(data) {
let newArr = [];
newArr = data.posts;
let postPage = document.getElementById("app");
console.log(postPage.innerHTML);
postPage.innerHTML = newArr.map((i, index) => {
  let likesAr = ([] = i.likes);
  let likesName = [];
  for (let index = 0; index < likesAr.length; index++) {
    likesName.push(` ${likesAr[index].name}`);
  }
  //render posts page new
  return `<div class="page-container" id ="page-container-id">
<div class="header-container" ></div>
<ul class="posts"id ="posts-id">
<li class="post" id ="post-id">
<div class="post-header" data-user-id="${i.user.id}">
<img src="${i.user.imageUrl}" class="post-header__user-image">
<p class="post-header__user-name">${i.user.name}</p>
</div>
<div class="post-image-container">
<img class="post-image" src="${i.imageUrl}">
</div>
<div class="post-likes">
<button data-post-id="${i.id}" class="like-button">
<img id="like-on"  src="${
  i.isLiked === true
    ? "./assets/images/like-active.svg"
    : "./assets/images/like-not-active.svg"
}">
</button>
<p class="post-likes-text" id ="likes-number-id">
Нравится: <strong>${i.likes.length}</strong>
</p>
</div>
<p class="post-text">
<span class="user-name">${likesName}</span>
${i.description}
</p>
<p class="post-date">
${i.createdAt}
</p>
</li>
</ul>
</div>`;
});
// переход на  страницу пользователя после пересоздания страницы
for (let userEl of document.querySelectorAll(".post-header")) {
  userEl.addEventListener("click", () => {
    let userPosts = [];
    return fetch(
      `https://wedev-api.sky.pro/api/v1/egor_torg/instapro/user-posts/${userEl.dataset.userId}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${user.token}` },
      }
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        // let newArr =[]
        // newArr=data.posts
        userPosts = data.posts;
        let postPage = document.getElementById("app");

        postPage.innerHTML = userPosts.map((i, index) => {
          let likesAr = ([] = i.likes);
          let likesName = [];
          for (let index = 0; index < likesAr.length; index++) {
            likesName.push(` ${likesAr[index].name}`);
          }
          //render posts page new
          return `<div class="page-container" id ="page-container-id">
          <div class="header-container" ></div>
          <ul class="posts"id ="posts-id">
          <li class="post" id ="post-id">
          <div class="post-header" data-user-id="${i.user.id}">
          <img src="${i.user.imageUrl}" class="post-header__user-image">
          <p class="post-header__user-name">${i.user.name}</p>
          </div>
          <div class="post-image-container">
          <img class="post-image" src="${i.imageUrl}">
          </div>
          <div class="post-likes">
          <button data-post-id="${i.id}" class="like-button">
          <img src="${
            i.isLiked === true
              ? "./assets/images/like-active.svg"
              : "./assets/images/like-not-active.svg"
          }">
          </button>
          <p class="post-likes-text" id ="likes-number-id">
          Нравится: <strong>${i.likes.length}</strong>
          </p>
          </div>
          <p class="post-text">
          <span class="user-name">${likesName}</span>
          ${i.description}
          </p>
          <p class="post-date">
          ${i.createdAt}
          </p>
          </li>
          </ul>
          </div>`;
        });
      })
  });
}
renderHeaderComponent({
  element: document.querySelector(".header-container"),
});
console.log(postPage.innerHTML);
const likePost = document.querySelectorAll(".like-button");
for (const likeEl of likePost) {
  let post = newArr.filter((item) => item.id === likeEl.dataset.postId);
  likeEl.addEventListener("click", () => {
    console.log(post[0]);
    if (post[0].isLiked === true) {
      return fetch(
        `https://wedev-api.sky.pro/api/v1/egor_torg/instapro/${likeEl.dataset.postId}/dislike`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${user.token}` },
        }
      )
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          console.log(`dislike -${data}`);
          for (let userEl of document.querySelectorAll(".post-header")) {
          return fetch(
            `https://wedev-api.sky.pro/api/v1/egor_torg/instapro/user-posts/${userEl.dataset.userId}`,
            {
              method: "GET",
              headers: { Authorization: `Bearer ${user.token}` },
            }
          )
            .then((response) => response.json())
            .then((data) => {
              let likeData = data;
              reRenderPostsUser(data);
              return likeData;
            })
          }
        })
    }
    return fetch(
      `https://wedev-api.sky.pro/api/v1/egor_torg/instapro/${likeEl.dataset.postId}/like`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${user.token}` },
      }
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(`like -${data}`);
        for (let userEl of document.querySelectorAll(".post-header")) {
        return fetch(
          `https://wedev-api.sky.pro/api/v1/egor_torg/instapro/user-posts/${userEl.dataset.userId}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${user.token}` },
          }
        )
          .then((response) => response.json())
          .then((data) => {
            let likeData = data;
            reRenderPostsUser(data);
            return likeData;
          })
        }
      })
  });
}}