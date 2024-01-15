// Функция для обновления значения счета и вызова пересчета
function handleBillInput(data) {
    const billAmount = parseFloat(document.getElementById('monthly-bill').value);
    document.getElementById('bill-value').textContent = `${billAmount} €/месяц`;
    updateCalculation(data);
}

// Функция для обновления списка панелей
function updatePanelOptions(data) {
    const panelTypeSelect = document.getElementById('panel-type');
    let panels = data.filter(item => item['Категория'] === 'Солнечные панели');
    panelTypeSelect.innerHTML = panels.map(panel => 
        `<option value="${panel['Мощность W']}">${panel['Наименование оборудования']}</option>`
    ).join('');
}

// Функция для обновления списка батарей
function updateBatteryOptions(data) {
    const batterySelect = document.getElementById('battery-type');
    let batteries = data.filter(item => item['Категория'] === 'Батарея');
    batterySelect.innerHTML = `<option value="0">Без батареи</option>` + batteries.map(battery =>
        `<option value="${battery['Цена eur']}">${battery['Наименование оборудования']}</option>`
    ).join('');
}
// Функция для расчета процента потребления энергии
function calculateEnergyConsumption(inverterPower, batteryType) {
    let consumptionPercentage;
    if (inverterPower >= 2000 && inverterPower <= 4000) {
        switch (batteryType) {
            case 'Без батареи':
                consumptionPercentage = 50;
                break;
            case 'Huawei Luna 5 kWh':
                consumptionPercentage = 70;
                break;
            case 'Huawei Luna 10 kWh':
            case 'Huawei Luna 15 kWh':
                consumptionPercentage = 80;
                break;
            default:
                consumptionPercentage = 50; // На случай, если выбор не соответствует указанным
        }
    } else if (inverterPower >= 2000 && inverterPower <= 10000) {
        switch (batteryType) {
            case 'Без батареи':
                consumptionPercentage = 50;
                break;
            case 'Huawei Luna 5 kWh':
                consumptionPercentage = 60;
                break;
            case 'Huawei Luna 10 kWh':
                consumptionPercentage = 70;
                break;
            case 'Huawei Luna 15 kWh':
                consumptionPercentage = 80;
                break;
            default:
                consumptionPercentage = 50; // На случай, если выбор не соответствует указанным
        }
    }
    return consumptionPercentage;

}

// Функция для обновления стоимости системы и комплектации
// Функция для обновления стоимости системы и комплектации
function updateCalculation(data) {
    const billAmount = parseFloat(document.getElementById('monthly-bill').value); // Используйте parseFloat
    const phaseType = document.getElementById('phase-type').value;
    const roofType = document.getElementById('roof-type').value;
    const selectedPanelPower = parseFloat(document.getElementById('panel-type').value);
    const batterySelect = document.getElementById('battery-type');
    const selectedBatteryPrice = parseFloat(batterySelect.value);
    const selectedBatteryName = batterySelect.options[batterySelect.selectedIndex].text;


// Здесь должна быть логика для выбора инвертора
let inverter; if (phaseType === 'single') {
    if (billAmount <= 100) {
        inverter = data.find(item => item['Наименование оборудования'] === 'Huawei SUN2000-2KTL-L1');
    } else if (billAmount <= 150) {
        inverter = data.find(item => item['Наименование оборудования'] === 'Huawei SUN2000-3KTL-L1');
    } else if (billAmount <= 200) {
        inverter = data.find(item => item['Наименование оборудования'] === 'Huawei SUN2000-4KTL-L1');
    } else if (billAmount <= 230) {
        inverter = data.find(item => item['Наименование оборудования'] === 'Huawei SUN2000-5KTL-L1');
    } else {
        inverter = data.find(item => item['Наименование оборудования'] === 'Huawei SUN2000-6KTL-L1');
    }
} else {
    // Логика для трехфазного инвертора
    if (billAmount <= 120) {
        inverter = data.find(item => item['Наименование оборудования'] === 'HUAWEI SUN2000-3KTL-M1');
    } else if (billAmount <= 180) {
        inverter = data.find(item => item['Наименование оборудования'] === 'HUAWEI SUN2000-4KTL-M1');
    } else if (billAmount <= 220) {
        inverter = data.find(item => item['Наименование оборудования'] === 'HUAWEI SUN2000-5KTL-M1');
    } else if (billAmount <= 280) {
        inverter = data.find(item => item['Наименование оборудования'] === 'HUAWEI SUN2000-6KTL-M1');
    } else if (billAmount <= 330) {
        inverter = data.find(item => item['Наименование оборудования'] === 'HUAWEI SUN2000-8KTL-M1');
    } else if (billAmount <= 400){
        inverter = data.find(item => item['Наименование оборудования'] === 'HUAWEI SUN2000-10KTL-M1');
    }
}
let inverterPrice = inverter['Цена eur']; // Получаем цену выбранного инвертора
let selectedPanel = data.find(item => item['Категория'] === 'Солнечные панели' && item['Мощность W'] === selectedPanelPower);
let numberOfPanels = Math.ceil(inverter['Мощность W'] / selectedPanel['Мощность W']);
let totalSystemPower = numberOfPanels * selectedPanel['Мощность W'];
let averageEnergyGeneration = Math.round (totalSystemPower * 0.13); // Переводим в kW и рассчитываем среднемесячную энергогенерацию
let structureType = roofType === 'pitched' ? 'Структура для наклонной крыши' : 'Структура для плоской крыши';
let structure = data.find(item => item['Категория'] === 'Структура' && item['Наименование оборудования'].includes(structureType));
let totalStructureCost = numberOfPanels * structure['Цена eur'];
let totalSystemCost = numberOfPanels * selectedPanel['Цена eur'] + totalStructureCost + parseFloat(inverterPrice);
let inverterPower = inverter ? inverter['Мощность W'] : 0;
let batteryType = batterySelect.options[batterySelect.selectedIndex].text;
let energyConsumption = calculateEnergyConsumption(inverterPower, batteryType);
let annualGeneration = averageEnergyGeneration * 12; // Среднемесячная генерация * 12 месяцев
let annualSavings = annualGeneration * 0.22 * energyConsumption / 100; // Умножаем на 0.2 и процент потребления

// Обновляем информацию о системе и комплектации
document.getElementById('system-power').textContent = `Мощность системы: ${totalSystemPower} W`;
document.getElementById('system-cost').textContent = `Стоимость системы: ${Math.round(totalSystemCost)} €`;
document.getElementById('average-energy').textContent = `Среднемесячная энергогенерация: ${Math.round(averageEnergyGeneration)} kW`;
// Добавляем название панелей
document.getElementById('panels-name').textContent = `Панели: ${selectedPanel['Наименование оборудования']}`;
document.getElementById('panels-info').textContent = `Количество панелей: ${numberOfPanels} штук`;
document.getElementById('inverter-info').textContent = `Инвертор: ${inverter['Наименование оборудования']}`;
document.getElementById('system-cost').textContent = `Стоимость системы: ${totalSystemCost.toFixed(2)} €`;
document.getElementById('battery-info').textContent = `Батарея: ${selectedBatteryName}`;
document.getElementById('consumption-value').textContent = energyConsumption;
document.getElementById('savings-value').textContent = annualSavings.toFixed(2); // Отображаем с двумя десятичными и округляем
}

// Загрузка данных и инициализация калькулятора
fetch('data.json')
.then(response => response.json())
.then(data => {
updatePanelOptions(data);
updateBatteryOptions(data);
// Обработчики событий для обновления расчетов
document.getElementById('monthly-bill').addEventListener('input', () => handleBillInput(data));
document.getElementById('phase-type').addEventListener('change', () => updateCalculation(data));
document.getElementById('panel-type').addEventListener('change', () => updateCalculation(data));
document.getElementById('roof-type').addEventListener('change', () => updateCalculation(data));
document.getElementById('battery-type').addEventListener('change', () => updateCalculation(data));
handleBillInput(data); // Вызов при инициализации для установки начального значения счета
})
.catch(error => console.error('Ошибка при загрузке данных:', error));