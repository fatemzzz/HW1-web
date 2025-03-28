document.addEventListener('DOMContentLoaded', function() {
    class FormulaCalculator {
        constructor() {
            this.formulaElements = document.querySelectorAll('formula');
            this.setupEventListeners();
            this.calculateAllFormulas();
        }

        setupEventListeners() {
            const inputs = document.querySelectorAll('input[type="number"]');
            inputs.forEach(input => {
                input.addEventListener('input', () => this.calculateAllFormulas());
            });
        }

        calculateAllFormulas() {
            this.formulaElements.forEach(formulaElement => {
                try {
                    const evaluator = formulaElement.getAttribute('evaluator');
                    const result = this.evaluateFormula(evaluator);
                    formulaElement.textContent = this.formatResult(result);
                } catch (error) {
                    console.error('Calculation error:', error);
                    formulaElement.textContent = 'Invalid Formula';
                }
            });
        }

        evaluateFormula(formula) {
            // Get all input values
            const context = {};
            document.querySelectorAll('input[type="number"]').forEach(input => {
                const value = parseFloat(input.value);
                context[input.id] = isNaN(value) ? 0 : value;
            });

            // Replace variables with values
            const replacedFormula = formula.replace(
                /[a-zA-Z_][a-zA-Z0-9_]*/g, 
                match => context.hasOwnProperty(match) ? context[match] : match
            );

            // Safely evaluate
            const result = new Function('return ' + replacedFormula)();
            return typeof result === 'number' ? result : NaN;
        }

        formatResult(value) {
            if (isNaN(value)) return 'Invalid Formula';
            if (!isFinite(value)) return 'Infinity';
            return value % 1 === 0 ? value.toString() : value.toFixed(2);
        }
    }

    // Initialize calculator
    new FormulaCalculator();
});