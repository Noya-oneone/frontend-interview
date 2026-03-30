# 策略模式（React）
策略模式是一种行为设计模式，它定义了算法族，分别封装起来，让它们之间可以相互替换，此模式让算法的变化，不会影响到使用算法的客户。

## 策略模式的优点
- 策略模式提供了一系列的算法，可以灵活选择，避免了大量的if-else语句。
- 策略模式可以避免使用多重条件语句，提高代码的可读性。
- 策略模式可以让算法的变化，不会影响到使用算法的客户。

## 策略模式的缺点
- 策略模式会增加代码的复杂度，需要创建多个类和对象。
- 策略模式会增加系统的耦合度，如果一个策略需要修改，则需要修改所有使用该策略的地方。

## 策略模式使用场景举例

* 计算器
* 表单验证
* React - 根据传入值的不同，实现不同的组件
    * 最差的方式就是使用 if 或者 switch 判断，根据不同的条件判断返回不同的组件，那么这种方式，如果判断的条数多起来，整个项目的代码是很丑的，那么这个时候我们就可以使用策略模式的方式来实现这一需求

## 策略模式的实现

下面我们来实现一个简单的策略模式，来实现一个加法运算的策略。

```javascript
class AdditionStrategy {
  static add(a, b) {
    return a + b;
  }
}


class SubtractionStrategy {
  static subtract(a, b) {
    return a - b;
  }
}

class MultiplicationStrategy {
  static multiply(a, b) {
    return a * b;
  }
}

class DivisionStrategy {
  static divide(a, b) {
    return a / b;
  }
}

class Calculator {
  constructor(strategy) {
    this.strategy = strategy;
  }

  calculate(a, b) {
    return this.strategy.calculate(a, b);
  }
}

const additionCalculator = new Calculator(AdditionStrategy);
const subtractionCalculator = new Calculator(SubtractionStrategy);
const multiplicationCalculator = new Calculator(MultiplicationStrategy);
const divisionCalculator = new Calculator(DivisionStrategy);

console.log(additionCalculator.calculate(2, 3)); // 5
console.log(subtractionCalculator.calculate(2, 3)); // -1
console.log(multiplicationCalculator.calculate(2, 3)); // 6
console.log(divisionCalculator.calculate(2, 3)); // 2
```

```javascript
    // 表单验证
    var strategies = {
        isNonEmpty: function (value, errorMsg) {
            if (value === "") {
            return errorMsg;
            }
        },
        minLength: function (value, length, errorMsg) {
            if (value.length < length) {
                return errorMsg;
            }
        },
        isMobile: function (value, errorMsg) {
            if (!/(^1[3|5|8][0-9]{9}$)/.test(value)) {
                return errorMsg;
            }
        },
    };
    var Validator = function () {
        this.cache = [];
    };
    Validator.prototype.add = function (dom, rules) {
    var self = this;
    for (var i = 0, rule; (rule = rules[i++]); ) {
        (function (rule) {
        var strategyAry = rule.strategy.split(":");
        var errorMsg = rule.errorMsg;
        self.cache.push(function () {
            var strategy = strategyAry.shift();
            strategyAry.unshift(dom.value);
            strategyAry.push(errorMsg);
            return strategies[strategy].apply(dom, strategyAry);
        });
        })(rule);
    }
    };
    Validator.prototype.start = function () {
        for (var i = 0, validatorFunc; (validatorFunc = this.cache[i++]); ) {
            var errorMsg = validatorFunc();
            if (errorMsg) {
                return errorMsg;
            }
        }
    };
```

```javascript
// react 不同组件
import File from "./file";
import Search from "./search";
import Setting from "./setting";
import Port from "./port";

export const components = {
  search: Search,
  setting: Setting,
  port: Port,
  file: File,
};

import { components } from "./component";

const Edit: FC = () => {
  const [activeIcon, setActiveIcon] = useState<labelType>("file");

  const Component = components[activeIcon];

  return <Component />;
};
```