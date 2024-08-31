// Maine container that contains feeds
let container = document.querySelector(".container .feeds_container");

// Add feed btn in modal
let addFeedBtn = document.getElementById("addFeedBtn");

// Modal that show feeds and allow you to control it
let feedsManager = document.getElementById("manageFeeds");

// Btn to remove all feeds with one click
let removeAllBtn = document.getElementById("removeAll");

// Get All Modals Btn To open modals dynamic
let modalsBtn = document.querySelectorAll(".modalBtn");

// Get All Modals Btn To close modals dynamic
let modalsCloseBtn = document.querySelectorAll(".closeModalBtn");

// Get All Modals
let modals = document.querySelectorAll(".modal");

// Check Modal Mode (add || update)
let mode = "add";
function changeFeedBtn() {
  addFeedBtn.innerHTML =
    mode === "add"
      ? "إضافة <box-icon color='white' name='add-to-queue'></box-icon>"
      : "حفظ <box-icon color='white' name='save'></box-icon>";
}

// The main data && Check if is there any saved data
let feeds = JSON.parse(localStorage.getItem("feeds"))
  ? JSON.parse(localStorage.getItem("feeds"))
  : [];

// Add array to local storage to save feeds data
function addToLocal(arr) {
  // arr => main data
  localStorage.setItem("feeds", JSON.stringify(arr));
}

// Add feed to data
function add_feed(feedData) {
  // Push feed data to the other feeds
  feeds.push(feedData);
  // add all data to the storage
  addToLocal(feeds);
  // show feeds in the modal without refresh
  manage_feeds();
  // show feeds in the page without refresh
  show_feeds();
}

// Get feed data depend on id
function get_feed(feed_id) {
  return feeds.find((feed) => feed.id === feed_id);
}

// Update feed information
function update_feed(newFeed) {
  let feed = get_feed(newFeed.id);
  if (feed) {
    let currentIndex = feeds.indexOf(feed);
    feeds[currentIndex].name = newFeed.name;
    feeds[currentIndex].desc = newFeed.desc;
    // update the variable with the new data
    addToLocal(feeds);
    // show feeds in the modal without refresh
    manage_feeds();
    // show feeds in the page without refresh
    show_feeds();
  }
}

// Remove feed
function remove_feed(feed_id) {
  let feed = get_feed(feed_id);
  if (feed) {
    if (feeds.indexOf(feed) > -1) {
      // remove feed by splicing his index from the array and save it to storage
      feeds.splice(feeds.indexOf(feed), 1);
      addToLocal(feeds);
      // show feeds in the modal without refresh
      manage_feeds();
      // show feeds in the page without refresh
      show_feeds();
    }
  } else {
    alert("هذا الخبر غير موجود أو تم حذفه");
  }
}

// Remove All Feeds
function removeAll() {
  localStorage.removeItem("feeds");
  // show feeds in the modal without refresh
  manage_feeds();
  // show feeds in the page without refresh
  show_feeds();
}
removeAllBtn.addEventListener("click", removeAll);

// Create element and assign a class
function create_element(type, className) {
  let element = document.createElement(type);
  element.className = className;
  return element;
}

function createFeedContainer(feed) {
  // Create Feed Container
  let feedCont = create_element("div", "feed");

  // Create Feed Image Div
  let imgCont = create_element("div", "image");

  // Create Feed Image
  let feedImg = document.createElement("img");
  feedImg.src = feed.img;
  feedImg.alt = "Feed Image";
  imgCont.appendChild(feedImg);
  feedCont.appendChild(imgCont);

  // Create Feed Content
  let content = create_element("div", "content");

  // Create Feed Title
  let feedTitle = create_element("p", "name");
  feedTitle.innerHTML = feed.name;

  // Create Feed Description
  let feedDesc = create_element("p", "description");
  feedDesc.innerHTML = feed.desc;

  content.appendChild(feedTitle);
  content.appendChild(feedDesc);
  feedCont.appendChild(content);
  return feedCont;
}

// Add Feed from add feed modal
addFeedBtn.addEventListener("click", () => {
  if (mode === "add") {
    let titleInput = document.getElementById("feedTitle").value;
    let imgInput = document.getElementById("feedImage").value;
    let descInput = document.getElementById("feedDesc").value;
    if (titleInput === "" || imgInput === "" || descInput === "") {
      window.event.preventDefault();
    } else {
      let feedData = {
        id: Math.floor(Date.now()),
        name: titleInput,
        img: imgInput,
        desc: descInput,
      };
      add_feed(feedData);
      titleInput = document.getElementById("feedTitle").value = "";
      imgInput = document.getElementById("feedImage").value = "";
      descInput = document.getElementById("feedDesc").value = "";
      changeClass(modals[0]);
    }
  }
});

// Show all feeds
function show_feeds() {
  mode = "add";
  changeFeedBtn();
  container.innerHTML = "";
  feeds.forEach((feed) => {
    // create the feed by function createFeedContainer() then append it to the container
    let feedCont = createFeedContainer(feed);
    container.appendChild(feedCont);
  });
}

// Show feeds' data into the modal to update or remove it
function manage_feeds() {
  feedsManager.innerHTML = "";
  feeds.forEach((feed, index) => {
    // create the feed then append it to the container
    let li = `
    <li>
      <p class="feed_info">
        <span class="id">${index + 1}</span>
        ${feed.name}
      </p>
      <div class="controls">
        <button class="edit_btn" id="edit" data-id="${feed.id}">
          <box-icon color="white" name="edit"></box-icon>
        </button>
        <button class="remove_btn" id="remove" data-id="${feed.id}">
          <box-icon
            color="white"
            name="message-square-x"></box-icon>
        </button>
      </div>
    </li>
    `;
    feedsManager.innerHTML += li;
  });

  let removeFeedBtns = document.querySelectorAll(".remove_btn"); // get feed's remove button
  removeFeedBtns.forEach((e) => {
    e.addEventListener("click", () => {
      // Remove feed using data-id
      remove_feed(+e.dataset.id);
    });
  });

  let editFeedBtns = document.querySelectorAll(".edit_btn"); // get feed's edit button
  editFeedBtns.forEach((e) => {
    e.addEventListener("click", () => {
      mode = "update";
      changeFeedBtn();
      if (mode === "update") {
        let feed = get_feed(+e.dataset.id);
        changeClass(modals[1]);
        changeClass(modals[0]);
        // Update Feed from feed modal
        document.getElementById("feedTitle").value = feed.name;
        document.getElementById("feedImage").value = feed.img;
        document.getElementById("feedDesc").value = feed.desc;
        addFeedBtn.addEventListener("click", () => {
          let titleInput = document.getElementById("feedTitle").value;
          let imgInput = document.getElementById("feedImage").value;
          let descInput = document.getElementById("feedDesc").value;
          if (titleInput === "" || imgInput === "" || descInput === "") {
            window.event.preventDefault();
          } else {
            let feedData = {
              id: feed.id,
              name: titleInput,
              img: imgInput,
              desc: descInput,
            };
            update_feed(feedData);
            titleInput = document.getElementById("feedTitle").value = "";
            imgInput = document.getElementById("feedImage").value = "";
            descInput = document.getElementById("feedDesc").value = "";
            changeClass(modals[0]);
            window.location.reload();
          }
        });
      }
    });
  });
}
manage_feeds();

// Get the target modal using dataset attr
function getModal(btn) {
  return Array.from(modals).find(
    (modal) => modal.dataset.modal === btn.dataset.target
  );
}

function changeClass(element) {
  // if !the class add it else remove
  element.classList.toggle("show");
}

// toggle class to the modal to open it or close
function modalStatus(modal) {
  changeClass(modal);
}

// Using The Function to open the modal
modalsBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    modalStatus(getModal(btn));
  });
});

// Using The Function to close the modal
modalsCloseBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    modalStatus(getModal(btn));
  });
});

// The Main Function To Show All Feeds
show_feeds();
