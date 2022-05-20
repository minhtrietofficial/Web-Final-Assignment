const wrapper = document.querySelector(".wrapper");
const fileName = document.querySelector(".file-name");
const defaultBtn = document.querySelector("#default-btn");
const customBtn = document.querySelector("#custom-btn");
const cancelBtn = document.querySelector("#cancel-btn i");
const img = document.querySelector("img");
let regExp = /[0-9a-zA-Z\^\&\'\@\{\}\[\]\,\$\=\!\-\#\(\)\.\%\+\~\_ ]+$/;
function defaultBtnActive() {
    defaultBtn.click();
}
defaultBtn.addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function () {
            const result = reader.result;
            img.src = result;
            wrapper.classList.add("active");
        }
        cancelBtn.addEventListener("click", function () {
            img.src = "";
            wrapper.classList.remove("active");
        })
        reader.readAsDataURL(file);
    }
    if (this.value) {
        let valueStore = this.value.match(regExp);
        fileName.textContent = valueStore;
    }
});
// kjdbkuagfiuewghiufhweoijfpwoejkfw
const wrapper1 = document.querySelector("#wrapper1");
const fileName1 = document.querySelector("#file-name1");
const defaultBtn1 = document.querySelector("#default-btn1");
const customBtn1 = document.querySelector("#custom-btn1");
const cancelBtn1 = document.querySelector("#cancel-btn1 i");
const img1 = document.querySelector("#imgresult1");
let regExp1 = /[0-9a-zA-Z\^\&\'\@\{\}\[\]\,\$\=\!\-\#\(\)\.\%\+\~\_ ]+$/;
function defaultBtnActive1() {
    defaultBtn1.click();
}
defaultBtn1.addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function () {
            const result = reader.result;
            img1.src = result;
            wrapper1.classList.add("active");
        }
        cancelBtn.addEventListener("click", function () {
            img1.src = "";
            wrapper1.classList.remove("active");
        })
        reader.readAsDataURL(file);
    }
    if (this.value) {
        let valueStore = this.value.match(regExp);
        fileName1.textContent = valueStore;
    }
});
