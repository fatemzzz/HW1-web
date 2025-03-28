
# توضیح تمرین دستگرمی درس وب
## پیاده‌سازی پروژه ماشین حساب فرمول
این یک برنامه تحت وب واکنش‌گراست که سه فرمول مختلف را به صورت لحظه‌ای با استفاده از مجموعه‌ای از ورودی‌های مشترک محاسبه می‌کند. ماشین حساب به محض تغییر هر یک از مقادیر ورودی، تمام نتایج را به‌روزرسانی می‌کند.
۳ ورودی قیمت تعداد و تخفیف داریم به همراه ۳ فرمول برای محاسبه نتایج. این مقادیر به شکل برخط همزمان با تغییر ورودی ها بروزرسانی می‌شوند و مقادیر جدید را نشان می‌دهند.

### پیاده‌سازی
#### 1. ساختار HTML 🏷️


```html
<div class="input-section">
  <div class="input-group">
    <label for="price">Unit Price:</label>
    <input type="number" id="price" placeholder="Enter price">
  </div>
  <!-- سایر فیلدهای ورودی -->
</div>

<div class="formula-section">
  <h2>Total Price Calculation</h2>
  <div class="formula-display">Formula: price * quantity - discount</div>
  <div class="result">
    <span>Result:</span>
    <formula evaluator="price * quantity - discount"></formula>
  </div>
</div>
```
* از تگ سفارشی <formula> استفاده شده که دارای attribute ای به نام evaluator است
* هر بخش فرمول شامل عنوان، نمایش فرمول متنی و نتیجه محاسبه است

#### 2. استایل‌دهی با CSS 🎨
```css 
.formula-section {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
}

.result {
  background-color: #e8f4fc;
  padding: 15px;
  border-radius: 4px;
  margin-top: 15px;
  font-size: 18px;
} 
```
* طراحی ریسپانسیو با مدیا کوئری‌ها
* استفاده از flexbox برای چیدمان

#### 3. پیاده‌سازی JavaScript ⚙️
کلاس اصلی FormulaCalculator

```javascript 
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
  
  // سایر متدها...
}
```
یک کلاس به نام FormulaCalculator تعریف شده که وظیفه‌ی آن خواندن فرمول‌ها از HTML، گوش دادن به تغییرات ورودی‌ها و محاسبه‌ی نتیجه‌ی فرمول‌هاست.

متد calculateAllFormulas

```javascript 
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
```
این تابع:
* هر عنصر <formula> را بررسی می‌کند.
* ویژگی evaluator (که فرمول در آن نوشته شده) را می‌خواند.
* فرمول را ارزیابی می‌کند.
* نتیجه را به صورت عددی نمایش می‌دهد یا اگر خطا داشت، "Invalid Formula" نشان می‌دهد.
متد evaluateFormula 

```javascript 
evaluateFormula(formula) {
  // ایجاد شیء context برای نگهداری مقادیر
  const context = {};
  document.querySelectorAll('input[type="number"]').forEach(input => {
    const value = parseFloat(input.value);
    context[input.id] = isNaN(value) ? 0 : value;
  });

  // جایگزینی متغیرها با مقادیر
  const replacedFormula = formula.replace(
    /[a-zA-Z_][a-zA-Z0-9_]*/g, 
    match => context.hasOwnProperty(match) ? context[match] : match
  );

  try {
    const result = new Function('return ' + replacedFormula)();
    return typeof result === 'number' ? result : NaN;
  } catch (e) {
    return NaN;
  }
}
```
در این تابع:
* ابتدا تمام ورودی‌های عددی خوانده می‌شوند و به یک شیء به نام context اضافه می‌شوند که کلید آن‌ها id ورودی‌ها است.
* سپس متغیرهای فرمول با مقادیر ورودی جایگزین می‌شوند.
* فرمول جایگزین‌شده به کمک new Function اجرا می‌شود و نتیجه برگردانده می‌شود.


#### 4. مدیریت خطاها ⚠️
```javascript
formatResult(value) {
  if (isNaN(value)) return 'Invalid Formula';
  if (!isFinite(value)) return 'Infinity';
  return value % 1 === 0 ? value.toString() : value.toFixed(2);
}
```
* تشخیص تقسیم بر صفر
* مدیریت ورودی‌های غیرعددی
* فرمت‌بندی مناسب نتایج
* بررسی NaN و Infinity در نتایج
* مقداردهی اولیه صفر برای ورودی‌های خالی
