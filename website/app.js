async function generateClickEventHandler(event) {
    event.preventDefault();
    const zip = document.getElementById("zip").value;
    const feelings = document.getElementById("feelings").value;
    console.log('zip', zip);
    console.log('feelings', feelings);
    const data = {
        zip: zip,
        feelings: feelings
    }
    const response = await fetch('http://localhost:3000/journal', {
        method: 'POST',
        mode: 'cors',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    const latestEntry = await response.json();
    console.log('latestEntry', latestEntry);
    if (latestEntry) {
        updateLatestEntry(latestEntry);
    }
}

document.getElementById("generate").addEventListener("click", generateClickEventHandler);

async function latestJournalEntry() {
    const response = await fetch('http://localhost:3000/journal/latest', {
        mode: 'cors',
        credentials: 'same-origin'
    });
    const latestEntry = await response.json();
    console.log('journalEntries latest', latestEntry);
    return latestEntry;
}

function updateLatestEntry(latestEntry) {
    const { date, temp, zip, feelings } = latestEntry;
    if (!date || !temp || !zip || !feelings) {
        return
    }
    document.getElementById("date").innerHTML = new Date(date);
    document.getElementById("temp").innerHTML = `${parseInt(temp)}°`;
    document.getElementById("content").innerHTML = `${zip} - ${feelings}`;
}

(async () => {
    const latestEntry = await latestJournalEntry();
    updateLatestEntry(latestEntry);
})();
