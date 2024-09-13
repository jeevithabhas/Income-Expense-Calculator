document.addEventListener('DOMContentLoaded', () => {
    const addBtn = document.getElementById('add-btn');
    const entryList = document.getElementById('entry-list');
    const totalIncomeEl = document.getElementById('total-income');
    const totalExpenseEl = document.getElementById('total-expense');
    const balanceEl = document.getElementById('Balance');
    const filterRadios = document.querySelectorAll('input[name="Filter"]');

    let entries = JSON.parse(localStorage.getItem('entries')) || [];

    const updateTotals = () => {
        let totalIncome = 0;
        let totalExpense = 0;

        entries.forEach(entry => {
            if (entry.type === 'Income') {
                totalIncome += entry.amount;
            } else if (entry.type === 'Expense') {
                totalExpense += entry.amount;
            }
        });

        totalIncomeEl.textContent = totalIncome.toFixed(2);
        totalExpenseEl.textContent = totalExpense.toFixed(2);
        balanceEl.textContent = (totalIncome - totalExpense).toFixed(2);
    };

    const renderEntries = (filter = 'all') => {
        entryList.innerHTML = '';

        entries.filter(entry => {
            if (filter === 'all') return true;
            return entry.type.toLowerCase() === filter;
        }).forEach((entry, index) => {
            const li = document.createElement('li');
            li.classList.add('flex', 'justify-between', 'items-center', 'bg-emerald-100', 'p-2', 'border', 'border-black', 'rounded','text-l','shadow-lg','font-medium','italic','text-stone-600');

            li.innerHTML = `
                <span>${entry.description}: ₹${entry.amount.toFixed(2)}</span>
                <div>
                    <button class="edit-btn bg-green-300 text-black p-2 shadow-lg rounded hover:bg-green-500">Edit ✏️</button>
                    
                    <button class="delete-btn bg-red-400 text-black p-2 shadow-lg rounded hover:bg-red-600">Delete 🗑️</button>

                </div>
            `;

            li.querySelector('.edit-btn').addEventListener('click', () => editEntry(index));
            li.querySelector('.delete-btn').addEventListener('click', () => deleteEntry(index));

            entryList.appendChild(li);
        });

        updateTotals();
    };

    const addEntry = () => {
        const description = document.getElementById('Description').value;
        const amount = parseFloat(document.getElementById('Amount').value);
        const type = document.querySelector('input[name="type"]:checked').value;

        if (description && !isNaN(amount) && amount > 0) {
            entries.push({ description, amount, type });
            localStorage.setItem('entries', JSON.stringify(entries));
            renderEntries();
            document.getElementById('Description').value = '';
            document.getElementById('Amount').value = '';
        } else {
            alert('Please enter valid description and amount.');
        }
    };

    const editEntry = (index) => {
        const entry = entries[index];
        document.getElementById('Description').value = entry.description;
        document.getElementById('Amount').value = entry.amount;
        document.querySelector(`input[name="type"][value="${entry.type}"]`).checked = true;

        entries.splice(index, 1);
        localStorage.setItem('entries', JSON.stringify(entries));
        renderEntries();
    };

    const deleteEntry = (index) => {
        entries.splice(index, 1);
        localStorage.setItem('entries', JSON.stringify(entries));
        renderEntries();
    };

    filterRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            const filterValue = radio.value.toLowerCase();
            renderEntries(filterValue);
        });
    });

    addBtn.addEventListener('click', addEntry);

    renderEntries();
});
