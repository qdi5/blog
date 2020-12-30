---
layout: post
published: true
categories: web前端
---

## name属性
transition组件的name属性，用于在过渡的时候，自动应用的class前缀名；transition在过渡的时候，一共有6个css的class名会用到，默认以v为前缀，分别是：    
```javascript
  v-enter
  v-enter-active
  v-enter-to
  v-leave
  v-leave-active
  v-leave-to
```
一个Vue过渡的过程大概是这样的：    
在进入动画之前，vue会自动给元素添加`v-enter`、`v-enter-active`，一旦进入动画开始被应用，v-enter类就会被删除，`v-enter-to`类被加入进来，等到开始动画结束后，v-enter-acitve和v-enter-to这两个类就被同时删除了；离开动画类似，在离开动画之前，Vue会自动给元素添加`v-leave`和`v-leave-active`这两个类，一旦离开动画开始被应用，v-leave类就会被删除，`v-leave-to`类被加入进来，等到离开动画结束后，v-leave-active和v-leave-to这两个类就会被同时删除了。