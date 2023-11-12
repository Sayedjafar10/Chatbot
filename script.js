const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelector(".close-btn");

let userMessage;
const API_Key = "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";
const inputInitHeight = chatInput.scrollHeight;

const levenshteinDistance = (a, b) => {
    const dp = Array.from(Array(a.length + 1), () => Array(b.length + 1).fill(0));

    for (let i = 0; i <= a.length; i++) {
        for (let j = 0; j <= b.length; j++) {
            if (i === 0) dp[i][j] = j;
            else if (j === 0) dp[i][j] = i;
            else dp[i][j] = Math.min(dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1), Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1));
        }
    }

    return dp[a.length][b.length];
};

const findClosestQuestion = (userMessage, questions) => {
    const similarityThreshold = 5;

    return questions.reduce((closestQuestion, currentQuestion) => {
        const distance = levenshteinDistance(userMessage.toLowerCase(), currentQuestion.toLowerCase());
        if (distance < closestQuestion.distance) {
            return { question: currentQuestion, distance };
        }
        return closestQuestion;
    }, { question: null, distance: Infinity }).question;
};

const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent =
        className === "outgoing"
            ? `<p></p>`
            : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
};

const generateResponse = (incomingChatLi) => {
    const messageElement = incomingChatLi.querySelector("p");

    const closestQuestion = findClosestQuestion(userMessage, javaQuestions);

    if (closestQuestion) {
        const answer = getJavaAnswer(closestQuestion);
        messageElement.textContent = answer;
    } else {
        const API_URL = "https://api.openai.com/v1/chat/completions";

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${API_Key}`,
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: userMessage }],
            }),
        };

        fetch(API_URL, requestOptions)
            .then((res) => res.json())
            .then((data) => {
                messageElement.textContent = data.choices[0].message.content;
            })
            .catch(() => {
                messageElement.classList.add("error");
                messageElement.textContent =
                    "An error occurred while fetching the response.";
            })
            .finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
    }
};

const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) return;
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}`;

    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(() => {
        const incomingChatLi = createChatLi("Thinking...", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);
};

chatInput.addEventListener("input", () => {
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});

sendChatBtn.addEventListener("click", handleChat);
chatbotCloseBtn.addEventListener("click", () =>
    document.body.classList.remove("show-chatbot")
);
chatbotToggler.addEventListener("click", () =>
    document.body.classList.toggle("show-chatbot")
);

const getJavaAnswer = (question) => {


    // ... (unchanged)


    switch (question) {
        case "What is Java?":
            return "Java is a high-level, object-oriented programming language developed by Sun Microsystems.";
        case "What is the main difference between JDK, JRE, and JVM?":
            return "JDK (Java Development Kit) is for development, JRE (Java Runtime Environment) is for running Java applications, and JVM (Java Virtual Machine) is the execution environment for Java bytecode.";
        case "Explain the main features of Java.":
            return "Java is platform-independent, object-oriented, robust, secure, and has automatic memory management.";
        case "What is a variable in Java?":
            return "A variable is a container that holds data, and its value can change during the program's execution.";
        case "What is the difference between int and Integer in Java?":
            return "int is a primitive data type, while Integer is a class in Java that wraps an int value.";
        case "What is a constructor?":
            return "A constructor is a special method used to initialize objects in Java. It has the same name as the class.";
        case "Explain the concept of method overloading.":
            return "Method overloading allows a class to have multiple methods with the same name but different parameters.";
        case "What is a static method in Java?":
            return "A static method belongs to the class rather than an instance of the class. It can be called without creating an instance of the class.";
        case "What is the this keyword in Java?":
            return "The this keyword refers to the current instance of the class and is used to differentiate instance variables from local variables.";
        case "What is an interface in Java?":
            return "An interface is a collection of abstract methods. Classes implement interfaces to provide specific behavior.";
        case "What is the super keyword?":
            return "The super keyword is used to refer to the immediate parent class object. It is used to invoke the parent class methods and variables.";
        case "What is the purpose of the final keyword?":
            return "The final keyword is used to declare constants, make methods not overrideable, and make classes not inheritable.";
        case "What is a package in Java?":
            return "A package is a way to organize related classes and interfaces. It helps in avoiding naming conflicts.";
        case "Explain the try, catch, and finally blocks in exception handling.":
            return "The try block contains the code that might throw an exception. The catch block handles the exception, and the finally block contains code that will be executed regardless of whether an exception is thrown.";
        case "What is the purpose of the throw statement?":
            return "The throw statement is used to explicitly throw an exception in Java.";
        case "What is the difference between checked and unchecked exceptions?":
            return "Checked exceptions must be caught at compile time or declared using the throws keyword, while unchecked exceptions do not need to be explicitly handled.";
        case "What is the NullPointerException?":
            return "NullPointerException occurs when trying to access an object or invoke a method on an object that is null.";
        case "What is the difference between String, StringBuilder, and StringBuffer?":
            return "String is immutable, while StringBuilder and StringBuffer are mutable. StringBuilder is not thread-safe, while StringBuffer is thread-safe.";
        case "What is the purpose of the break statement?":
            return "The break statement is used to terminate the loop or switch statement it is in.";
        case "What is the continue statement?":
            return "The continue statement is used to skip the rest of the loop's code and move to the next iteration.";
        case "What is the purpose of the for-each loop?":
            return "The for-each loop simplifies iterating over collections and arrays, eliminating the need for explicit indexing.";
        case "How is multithreading achieved in Java?":
            return "Multithreading in Java is achieved by extending the Thread class or implementing the Runnable interface.";
        case "What is synchronization in Java?":
            return "Synchronization is the process of controlling the access of multiple threads to shared resources to avoid data inconsistency.";
        case "Explain the concept of garbage collection in Java.":
            return "Garbage collection is the process of automatically reclaiming memory occupied by objects that are no longer reachable.";
        case "What is the difference between == and .equals() for comparing objects?":
            return "== compares object references, while .equals() compares the content or values of objects. It needs to be overridden for meaningful comparison.";
        case "What is the instanceof operator used for?":
            return "The instanceof operator is used to test whether an object is an instance of a particular class or interface.";
        case "What is method overriding?":
            return "Method overriding allows a subclass to provide a specific implementation for a method that is already defined in its superclass.";
        case "What is the abstract keyword?":
            return "The abstract keyword is used to declare abstract classes and methods. Abstract classes cannot be instantiated, and abstract methods must be implemented by subclasses.";
        case "What is the final method?":
            return "A final method cannot be overridden by subclasses.";
        case "What is polymorphism?":
            return "Polymorphism allows objects of different classes to be treated as objects of a common superclass through method overriding.";
        case "What is the toString() method?":
            return "The toString() method is used to represent an object as a string. It is often overridden in classes to provide a meaningful string representation.";
        case "Explain the super() method.":
            return "The super() method is used to call the constructor of the immediate parent class. It is typically used in the constructor of the subclass.";
        case "What is an enum in Java?":
            return "An enum is a special type of class that represents a fixed set of constants.";
        case "What is a ternary operator in Java?":
            return "The ternary operator (? :) is a shorthand way of writing an if-else statement in a single line.";
        case "What is autoboxing and unboxing?":
            return "Autoboxing is the process of converting a primitive type to its corresponding wrapper class, and unboxing is the reverse.";
        case "What is the static block?":
            return "The static block is a block of code inside a class that is executed only once when the class is loaded into memory.";
        case "What is the purpose of the this() constructor call?":
            return "The this() constructor call is used to invoke the current class's constructor.";
        case "fuck you":
            return " Did I do something wrong ?";
        case "thank you ": 
            return"You are welcome ";
        case "No":
            return "OK!";

        // Add more Java questions and their corresponding answers
        default:
            return "I'm sorry, I don't have an answer for that specific Java question.";
    }
};




const javaQuestions = [
    // ... (unchanged)
    "What is Java?",
    "Thank you",
    "thank you",
    "No",
    "fuck you",
    "What is the main difference between JDK, JRE, and JVM?",
    "Explain the main features of Java.",
    "What is a variable in Java?",
    "What is the difference between int and Integer in Java?",
    "What is a constructor?",
    "Explain the concept of method overloading.",
    "What is a static method in Java?",
    "What is the this keyword in Java?",
    "What is an interface in Java?",
    "What is the super keyword?",
    "What is the purpose of the final keyword?",
    "What is a package in Java?",
    "fuck you ",
    "Explain the try, catch, and finally blocks in exception handling.",
    "What is the purpose of the throw statement?",
    "What is the difference between checked and unchecked exceptions?",
    "What is the NullPointerException?",
    "What is the difference between String, StringBuilder, and StringBuffer?",
    "What is the purpose of the break statement?",
    "What is the continue statement?",
    "What is the purpose of the for-each loop?",
    "How is multithreading achieved in Java?",
    "What is synchronization in Java?",
    "Explain the concept of garbage collection in Java.",
    "What is the difference between == and .equals() for comparing objects?",
    "What is the instanceof operator used for?",
    "What is method overriding?",
    "What is the abstract keyword?",
    "What is the final method?",
    "What is polymorphism?",
    "What is the toString() method?",
    "Explain the super() method.",
    "What is an enum in Java?",
    "What is a ternary operator in Java?",
    "What is autoboxing and unboxing?",
    "What is the static block?",
    "What is the purpose of the this() constructor call?"



];
