function startTypingEffect(elementId, text, speed = 30) {
      const element = document.getElementById(elementId);
      if (!element) return;

      element.innerHTML = ""; // Clear old content
      let index = 0;

      const cursor = document.createElement("span");
      cursor.classList.add("typing-cursor");
      cursor.innerHTML = "|";
      element.appendChild(cursor);

      function typeChar() {
        if (index < text.length) {
          cursor.insertAdjacentText("beforebegin", text.charAt(index));
          index++;
          setTimeout(typeChar, speed);
        } else {
          cursor.classList.add("done"); // Stop cursor blinking after finishing
        }
      }
      typeChar();
    }
