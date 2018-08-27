# 继承

首先定义一个父类Animal

```javascript
function Animal (name = 'Animal') {
  this.name = name
  this.showName = function () {
    console.log(`动物的名字叫${this.name}`)
  }
}
Animal.prototype.age = function (age = 24) {
  console.log(`${this.name}的年龄是${age}岁`)
}

```

>1.原型链继承

思路：实例化父类覆盖子类原型

```javascript
function Cat (color = 'yellow') {
  this.color = color
}
Cat.prototype = new Animal()

const cat1 = new Cat()

console.log(cat1 instanceof Cat) // true
console.log(cat1 instanceof Animal) // true
```

> 缺点

  1. 为子类的原型增加自身方法/属性必须在实例化父类之后；
  2. 子类生成的实例既是子类的实例又是父类的实例；
  3. 无法在子类实例化的时候灵活给父类传参；
  4. 多个子类实例的原型共享，其中一个子类实例的原型被修改则其他子类实例的原型也会修改（严重）；
  5. 无法实现多继承（严重）；

---

>2.构造继承

```javascript
function Cat (color = 'yellow') {
  Animal.call(this, '张三的猫')
  this.color = color
}
```

> 优点

  1. 解决第一种继承方法中的多个子类实例共享原型的缺点；
  2. 可以向父类的构造函数传递参数；
  3. 可以实现多继承（定义多个call）；

> 缺点

  1. 只能继承父类实例的属性，原型链的属性/方法不能继承；
  2. 生成的实例只是子类的实例，并不是父类的实例；

---

>3.组合继承

```javascript
function Cat (color = 'yellow') {
  Animal.call(this, '李四的猫')
}
Cat.prototype = Animal.prototype
Cat.prototype.constructor = Cat
```

> 优点
  1. 完全实现继承父类的实例属性和原型属性；

> 缺点
  1. 调用了两次父类构造函数，生成了两份实例；

>4.寄生继承

```javascript
function Cat (color = 'yellow') {
  Animal.call(this, '王五的猫')
}
var o = function () {}
o.prototype = Animal.prototype
Cat.prototype = new o()
Cat.prototype.constructor = Cat
```