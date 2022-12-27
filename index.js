window.onload = main;

function main() {
    const calculateButton = document.getElementById("calculate-button");
    calculateButton.onclick = collectUserData;
}

function collectUserData(e) {
    e.preventDefault(); //prevent the form from refreshing the page

    const loanAmount = document.getElementById("loan-amount").value;
    const interestRateDividedByOneHundred = document.getElementById("interest-rate").value / 100;
    const loanTermInYears = document.getElementById("loan-term").value * 12;

    buildServerUrlPath(loanAmount, interestRateDividedByOneHundred, loanTermInYears);
}

function buildServerUrlPath(loanAmount, interestRate, loanTerm) {
    let serverUrl = `https://mortgage-monthly-payment-calculator.p.rapidapi.com/revotek-finance/mortgage/monthly-payment?loanAmount=${loanAmount}&interestRate=${interestRate}&terms=${loanTerm}`;

    serverCall(serverUrl);
}

function serverCall(serverUrl) {
    const options = {
    	method: 'GET',
    	headers: {
    		'X-RapidAPI-Key': 'f54abc4d2fmshd969db99c8e1435p12fcd9jsna9e84fd8eb83',
    		'X-RapidAPI-Host': 'mortgage-monthly-payment-calculator.p.rapidapi.com'
    	}
    };
    
    fetch(serverUrl, options)
    	.then(response => {
            if (!response.ok) {
                throw new Error("We have a 404 or similar error.");
            }

            const typeOfHeaders = response.headers.get("content-type");
            if (typeOfHeaders !== "application/json") {
                throw new TypeError(`Expected JASON, got ${typeOfHeaders}`);                
            }

            return response.json();
        })
    	.then(monthlyRepayment => formatMonthlyRepayment(monthlyRepayment.monthlyPayment))
    	.catch(err => console.error(err));
}

function formatMonthlyRepayment(monthlyRepayment) {
    const poundsFormat = new Intl.NumberFormat("en", {
        style: "currency",
        currency: "GBP",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    const monthlyMortgageRepaymentFormattedInPounds = poundsFormat.format(monthlyRepayment);
    displayMonthlyMortgageRepaymentToUser(monthlyMortgageRepaymentFormattedInPounds);
    console.log(monthlyMortgageRepaymentFormattedInPounds);
}

function displayMonthlyMortgageRepaymentToUser(monthlyMortgageRepaymentFormattedInPounds) {
    const displayContainer = document.getElementById("display-container");
    displayContainer.innerHTML = `Your monthly mortgage repayment is: ${monthlyMortgageRepaymentFormattedInPounds}.`;
}