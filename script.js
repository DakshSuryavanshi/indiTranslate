//hero section
document.addEventListener("DOMContentLoaded", function() {
  const hero = document.querySelector(".hero");

  setTimeout(() => {
      hero.classList.add("active");
  }, 200);
});

//input language card
const dropdowns = document.querySelectorAll(".dropdown-container");
const inputLanguageDropdown = document.querySelector("#input-language");
const outputLanguageDropdown = document.querySelector("#output-language");

function populateDropdown(dropdown, options) {
  dropdown.querySelector("ul").innerHTML = "";
  options.forEach((option) => {
      const li = document.createElement("li");
      const title = option.name + " (" + option.native + ")";
      li.innerHTML = title;
      li.dataset.value = option.code;
      li.classList.add("option");
      dropdown.querySelector("ul").appendChild(li);
  });
}

populateDropdown(inputLanguageDropdown, languages);
populateDropdown(outputLanguageDropdown, languages);


//output language card
const dropdownss = document.querySelectorAll(".dropdownn-container");
const inputLanguageDropdownn = document.querySelector("#inputt-language");
const outputLanguageDropdownn = document.querySelector("#outputt-language");

function populateDropdown(dropdownn, options) {
  dropdownn.querySelector("ul").innerHTML = "";
  options.forEach((option) => {
      const li = document.createElement("li");
      const title = option.name + " (" + option.native + ")";
      li.innerHTML = title;
      li.dataset.value = option.code;
      li.classList.add("option");
      dropdownn.querySelector("ul").appendChild(li);
  });
}

populateDropdown(inputLanguageDropdownn, languages);
populateDropdown(outputLanguageDropdownn, languages);



dropdowns.forEach((dropdown) => {
  dropdown.addEventListener("click", (e) => {
      dropdown.classList.toggle("active");
  });

  dropdown.querySelectorAll(".option").forEach((item) => {
      item.addEventListener("click", (e) => {
          dropdown.querySelectorAll(".option").forEach((item) => {
              item.classList.remove("active");
          });
          item.classList.add("active");
          const selected = dropdown.querySelector(".selected");
          selected.innerHTML = item.innerHTML;
          selected.dataset.value = item.dataset.value;
      });
  });
});
document.addEventListener("click", (e) => {
  dropdowns.forEach((dropdown) => {
      if (!dropdown.contains(e.target)) {
          dropdown.classList.remove("active");
      }
  });
});

//swap button
const swapBtn = document.querySelector(".swap-position"),
  inputLanguage = inputLanguageDropdown.querySelector(".selected"),
  outputLanguage = outputLanguageDropdown.querySelector(".selected"),
  inputTextElem = document.querySelector("#input-text"),
  outputTextElem = document.querySelector("#output-text");

swapBtn.addEventListener("click", (e) => {
  const temp = inputLanguage.innerHTML;
  inputLanguage.innerHTML = outputLanguage.innerHTML;
  outputLanguage.innerHTML = temp;

  const tempValue = inputLanguage.dataset.value;
  inputLanguage.dataset.value = outputLanguage.dataset.value;
  outputLanguage.dataset.value = tempValue;

  const tempInputText = inputTextElem.value;
  inputTextElem.value = outputTextElem.value;
  outputTextElem.value = tempInputText;
});

const uploadDocument = document.querySelector("#upload-document"),
  uploadTitle = document.querySelector("#upload-title");

uploadDocument.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file.type === "application/pdf") {
      uploadTitle.innerHTML = file.name;

      // Use pdf.js to extract text from the PDF file
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = async (e) => {
          const arrayBuffer = e.target.result;
          const pdf = await pdfjsLib.getDocument({
              data: arrayBuffer
          }).promise;
          const text = [];
          for (let i = 1; i <= pdf.numPages; i++) {
              const page = await pdf.getPage(i);
              const pageText = await page.getTextContent();
              pageText.items.forEach((item) => {
                  text.push(item.str);
              });
          }
          inputTextElem.value = text.join("\n");
      };
  } else if (
      file.type === "text/plain" ||
      file.type === "application/msword" ||
      file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
      // Handle other supported file types
      uploadTitle.innerHTML = file.name;
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = (e) => {
          inputTextElem.value = e.target.result;
      };
  } else {
      alert("Please upload a valid file");
  }
});

const startRecordButton = document.getElementById('startRecord');
const stopRecordButton = document.getElementById('stopRecord');
const audioPlayer = document.getElementById('audioPlayer');
let mediaRecorder;
let audioChunks = [];

async function startRecording() {
  const stream = await navigator.mediaDevices.getUserMedia({
      audio: true
  });
  mediaRecorder = new MediaRecorder(stream);

  mediaRecorder.ondataavailable = event => {
      if (event.data.size > 0) {
          audioChunks.push(event.data);
      }
  };

  mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, {
          type: 'audio/wav'
      });
      audioPlayer.src = URL.createObjectURL(audioBlob);
  };

  mediaRecorder.start();
  startRecordButton.disabled = true;
  stopRecordButton.disabled = false;
}

function stopRecording() {
  mediaRecorder.stop();
  startRecordButton.disabled = false;
  stopRecordButton.disabled = true;
}

startRecordButton.addEventListener('click', startRecording);
stopRecordButton.addEventListener('click', stopRecording);

// image
const uploadImageInput = document.querySelector("#upload-image");
const imagePreview = document.querySelector("#image-preview");
const uploadImageTitle = document.querySelector("#upload-image-title");

uploadImageInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
      if (file.type.startsWith("image/")) {
          uploadImageTitle.innerHTML = file.name;

          // Display the image preview
          const reader = new FileReader();
          reader.onload = function(e) {
              imagePreview.src = e.target.result;
              imagePreview.style.display = "block";
          };
          reader.readAsDataURL(file);
      } else {
          alert("Please upload a valid image file.");
      }
  } else {
      // Handle no file selected
      alert("Please select an image to upload.");
  }
});


const downloadBtn = document.querySelector("#download-btn");

downloadBtn.addEventListener("click", (e) => {
  const outputText = outputTextElem.value;
  const outputLanguage =
      outputLanguageDropdown.querySelector(".selected").dataset.value;
  if (outputText) {
      const blob = new Blob([outputText], {
          type: "text/plain"
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.download = `translated-to-${outputLanguage}.txt`;
      a.href = url;
      a.click();
  }
});

//theme
//theme
const darkModeCheckbox = document.getElementById("dark-mode-btn");
const isDarkModeEnabled = localStorage.getItem("darkModeEnabled");

// Check local storage for the theme preference and set it if available
if (isDarkModeEnabled === "true") {
  document.body.classList.add("dark");
  darkModeCheckbox.checked = true;
}

darkModeCheckbox.addEventListener("change", () => {
  if (darkModeCheckbox.checked) {
    document.body.classList.add("dark");
    localStorage.setItem("darkModeEnabled", "true");
  } else {
    document.body.classList.remove("dark");
    localStorage.setItem("darkModeEnabled", "false");
  }
});


const inputChars = document.querySelector("#input-chars");

inputTextElem.addEventListener("input", (e) => {
  inputChars.innerHTML = inputTextElem.value.length;
});



//sign in pop up
const signInButton = document.getElementById('signInButton');
const signInPopup = document.getElementById('signInPopup');
const closePopup = document.getElementById('closePopup');

signInButton.addEventListener('click', () => {
  signInPopup.style.display = 'block';
});

closePopup.addEventListener('click', () => {
  signInPopup.style.display = 'none';
});

// Close the popup if the user clicks outside of it
window.addEventListener('click', (event) => {
  if (event.target === signInPopup) {
      signInPopup.style.display = 'none';
  }
});



//faq pop up
const faqLink = document.getElementById('faqLink');
const faqPopup = document.getElementById('faqPopup');
const faqclosePopup = document.getElementById('faqclosePopup');

faqLink.addEventListener('click', (event) => {
  faqPopup.style.display = 'block';
});

faqclosePopup.addEventListener('click', () => {
  faqPopup.style.display = 'none';
});

// Close the popup if the user clicks outside of it
window.addEventListener('click', (event) => {
  if (event.target === faqPopup) {
      faqPopup.style.display = 'none';
  }
});



//privacy policy pop up
const ppLink = document.getElementById('ppLink');
const ppPopup = document.getElementById('ppPopup');
const ppclosePopup = document.getElementById('ppclosePopup');

ppLink.addEventListener('click', (event) => {
  ppPopup.style.display = 'block';
});

ppclosePopup.addEventListener('click', () => {
  ppPopup.style.display = 'none';
});

// Close the popup if the user clicks outside of it
window.addEventListener('click', (event) => {
  if (event.target === ppPopup) {
      ppPopup.style.display = 'none';
  }
});

//responsive nav menu
function myFunctionmenu() {
  var x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += "responsive";
  } else {
    x.className = "topnav";
  }
}

// function myFunctionmenu1() {
//   var x = document.getElementById("myTopnav1");
//   if (x.className === "navright") {
//     x.className += "responsive";
//   } else {
//     x.className = "navright";
//   }
// }

