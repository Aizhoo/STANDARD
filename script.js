// Get all input elements
const inputs = {
    commodityPrice: document.getElementById('commodityPrice'),
    cupScore: document.getElementById('cupScore'),
    country: document.getElementById('country'),
    deliveryPort: document.getElementById('deliveryPort'),
    shippingCosts: document.getElementById('shippingCosts'),
    importerMarkup: document.getElementById('importerMarkup'),
    laborPercentage: document.getElementById('laborPercentage'),
    bagCost: document.getElementById('bagCost'),
    labelCost: document.getElementById('labelCost'),
    overhead: document.getElementById('overhead'),
    roastingShrinkage: document.getElementById('roastingShrinkage'),
    desiredMargin: document.getElementById('desiredMargin')
};

// Get tariff display element
const tariffDisplay = document.getElementById('tariffDisplay');

// Get refresh button
const refreshButton = document.getElementById('refreshButton');

// Get all output elements
const outputs = {
    finalPrice: document.getElementById('finalPrice'),
    totalCost: document.getElementById('totalCost'),
    totalCostPerBag: document.getElementById('totalCostPerBag'),
    grossMarginPercent: document.getElementById('grossMarginPercent'),
    roi: document.getElementById('roi'),
    containerFinalPrice: document.getElementById('containerFinalPrice'),
    containerTotalCost: document.getElementById('containerTotalCost'),
    containerGrossMarginPercent: document.getElementById('containerGrossMarginPercent'),
    containerRoi: document.getElementById('containerRoi'),
    shippingCostPerPallet: document.getElementById('shippingCostPerPallet'),
    shippingCostPerContainer: document.getElementById('shippingCostPerContainer'),
    fairValue: document.getElementById('fairValue'),
    euroValue: document.getElementById('euroValue'),

};

// Function to calculate the pricing
function calculatePricing() {
    // Get input values
    const commodityPrice = parseFloat(inputs.commodityPrice.value) || 0;
    const cupScore = parseFloat(inputs.cupScore.value) || 85;
    const specialtyPremium = (cupScore - 80) * 0.5; // Calculate specialty premium based on cup score
    const countryPremium = parseFloat(inputs.country.value) || 0; // Country premium/discount
    const deliveryPortDiscount = parseFloat(inputs.deliveryPort.value) || 0; // Delivery port discount
    const shippingCosts = parseFloat(inputs.shippingCosts.value) || 0; // Fixed cost
    const importerMarkup = parseFloat(inputs.importerMarkup.value) || 0;
    const laborPercentage = parseFloat(inputs.laborPercentage.value) || 0;
    const bagCost = parseFloat(inputs.bagCost.value) || 0;
    const labelCost = parseFloat(inputs.labelCost.value) || 0;
    const overhead = parseFloat(inputs.overhead.value) || 0;
    const roastingShrinkage = parseFloat(inputs.roastingShrinkage.value) || 0;
    const desiredMargin = parseFloat(inputs.desiredMargin.value) || 0;

    // Determine tariff rate based on country and delivery port
    let tariffRate = 0;
    const country = inputs.country.value;
    const deliveryPort = inputs.deliveryPort.value;
    
    // Debug logging
    console.log('Country:', country);
    console.log('Delivery Port:', deliveryPort);

    // Get the text of the selected options
    const selectedCountry = inputs.country.options[inputs.country.selectedIndex].text;
    const selectedPort = inputs.deliveryPort.options[inputs.deliveryPort.selectedIndex].text;
    
    // Debug logging
    console.log('Selected Country:', selectedCountry);
    console.log('Selected Port:', selectedPort);

    // EU ports
    if (selectedPort === 'Bremen/Hamburg' || selectedPort === 'Antwerp' || selectedPort === 'Barcelona') {
        tariffRate = 0; // All countries have 0% tariff for EU imports
    }
    // USA ports
    else {
        // USA Import Tariffs
        if (selectedCountry === 'Mexico') {
            tariffRate = 0;
        } else if (selectedCountry === 'Nicaragua') {
            tariffRate = 19;
        } else if (selectedCountry === 'India') {
            tariffRate = 26;
        } else {
            tariffRate = 10;
        }
    }

    // Update tariff display
    tariffDisplay.textContent = `${tariffRate}%`;
    console.log('Tariff rate:', tariffRate + '%');

    // Calculate raw inputs first
    const baseCost = commodityPrice + specialtyPremium;
    console.log('Base cost:', baseCost.toFixed(2));
    
    // Add tariff
    const tariffCost = baseCost * (tariffRate / 100);
    const costAfterTariff = baseCost + tariffCost;
    console.log('Cost after tariff:', costAfterTariff.toFixed(2));
    
    // Add importing costs
    const importerCost = costAfterTariff * (importerMarkup / 100);
    const costAfterImporting = costAfterTariff + importerCost;
    console.log('Cost after importing:', costAfterImporting.toFixed(2));
    
    // Add shipping costs
    const shippingPerLb = shippingCosts / 1500; // Convert shipping cost to per pound (pallet size is 1500 lbs, 10 bags)
    const costAfterShipping = costAfterImporting + shippingPerLb;
    console.log('Cost after shipping:', costAfterShipping.toFixed(2));
    console.log('Shipping cost per lb:', shippingPerLb.toFixed(4));
    console.log('Each pallet contains 10 bags (1500 lbs total)');
    
    // Add labor percentage
    const laborCost = costAfterShipping * (laborPercentage / 100);
    const costAfterLabor = costAfterShipping + laborCost;
    console.log('Cost after labor:', costAfterLabor.toFixed(2));
    
    // Adjust for roasting shrinkage
    const shrinkageFactor = 1 / (1 - (roastingShrinkage / 100));
    const costAfterShrinkage = costAfterLabor * shrinkageFactor;
    console.log('Cost after shrinkage:', costAfterShrinkage.toFixed(2));
    
    // Add retail bag and label costs
    const costAfterBags = costAfterShrinkage + bagCost + labelCost;
    console.log('Cost after bags and labels:', costAfterBags.toFixed(2));
    
    // Add overhead
    const totalCostPerLb = costAfterBags + overhead;
    console.log('Total cost per lb:', totalCostPerLb.toFixed(2));

    // Calculate final price with desired margin
    const finalPrice = totalCostPerLb * (1 + (desiredMargin / 100));

    // Calculate fair value (total cost + 35%)
    const fairValue = totalCostPerLb * 1.35;
    outputs.fairValue.textContent = `$${fairValue.toFixed(2)}`;

    // Calculate euro value (using current exchange rate of 1 USD = 0.90 EUR)
    const euroValue = fairValue * 0.90;
    outputs.euroValue.textContent = `€${euroValue.toFixed(2)}`;

    // Calculate gross margin percentage

    // Calculate gross margin percentage
    const grossMarginPercent = (finalPrice - totalCostPerLb) / finalPrice * 100;

    // Update output elements
    outputs.finalPrice.textContent = `$${finalPrice.toFixed(2)}`;
    outputs.totalCost.textContent = `$${totalCostPerLb.toFixed(2)}`;
    outputs.totalCostPerBag.textContent = `$${(totalCostPerLb * 150).toFixed(2)}`;
    outputs.grossMarginPercent.textContent = `${grossMarginPercent.toFixed(1)}%`;
    
    // Calculate ROI in dollars per bag (150 lbs)
    const roi = (finalPrice - totalCostPerLb) * 150; // Calculate ROI directly from price and cost
    outputs.roi.textContent = `$${roi.toFixed(2)}`;
    
    // Calculate container-level metrics (37,500 lbs)
    const containerSize = 37500; // 37,500 lbs per container
    const containerFinalPrice = finalPrice * containerSize;
    const containerTotalCost = totalCostPerLb * containerSize;
    const containerRoi = containerFinalPrice - containerTotalCost;

    outputs.containerFinalPrice.textContent = `$${containerFinalPrice.toFixed(2)}`;
    outputs.containerTotalCost.textContent = `$${containerTotalCost.toFixed(2)}`;
    outputs.containerRoi.textContent = `$${containerRoi.toFixed(2)}`;
    
    console.log('Container-level calculations:');
    console.log('Final Price/container:', containerFinalPrice.toFixed(2));
    console.log('Total Cost/container:', containerTotalCost.toFixed(2));
    console.log('ROI/container:', containerRoi.toFixed(2));
    
    // Calculate shipping costs
    const shippingCostPerPallet = parseFloat(inputs.shippingCosts.value) || 0;
    const palletsPerContainer = 37500 / 1500; // 37,500 lbs / 1500 lbs per pallet = 25 pallets
    const shippingCostPerContainer = shippingCostPerPallet * palletsPerContainer;
    
    // Update shipping cost outputs
    outputs.shippingCostPerPallet.textContent = `$${shippingCostPerPallet.toFixed(2)}`;
    outputs.shippingCostPerContainer.textContent = `$${shippingCostPerContainer.toFixed(2)}`;
    
    console.log('Shipping costs:');
    console.log('Shipping cost per pallet:', shippingCostPerPallet.toFixed(2));
    console.log('Shipping cost per container:', shippingCostPerContainer.toFixed(2));
}

// Function to calculate specialty premium based on cup score
function calculateSpecialtyPremium() {
    const cupScore = parseFloat(inputs.cupScore.value) || 85;
    const specialtyPremium = (cupScore - 80) * 0.5;
    // No need to update the specialtyPremium input since it's not visible
}

// Add event listeners to all input fields
Object.values(inputs).forEach(input => {
    // Use change event for select elements, input event for others
    const event = input.type === 'select-one' ? 'change' : 'input';
    input.addEventListener(event, () => {
        console.log('Input changed:', input.id);
        calculatePricing();
    });
});

// Add event listener for cup score to update specialty premium
inputs.cupScore.addEventListener('input', () => {
    console.log('Cup score changed');
    calculateSpecialtyPremium();
    calculatePricing();
});



// Initial calculation
window.addEventListener('load', calculatePricing);
