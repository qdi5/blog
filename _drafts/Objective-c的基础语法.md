---
layout: post
---
## 1、定义类
```objective-c
    @interface SimpleClass: NSObject;
    @end
```
以上代码定义了一个SimpleClass类，继承自NSObject    

## 2、类的属性声明
```objective-c
    @interface SimpleClass: NSObject
        @property (nonatomic,strong)NSString *firstName;
        @property int yearOfBirth;
        @property (readonly)NSString*firstName;
    @end
```    
## 3、减号方法（实例方法）申明；实例对象使用
```objective-c
    - (int) report {
        return 20;
    }
```

## 4、加号方法（静态方法）申明；类里面使用
```objective-c
    + (void)reports {
        NSLog(@"reports")
    }
```   
## 5、日志打印    
```objective-c   
    int a=1
    NSLog(@"hello objective-c");
    // 输出int类型的变量
    NSLog(@"%d",a);
    // 输出字符串类型的变量
    NSString *b=@"123";
    NSLog(@"%@",b)
```    
`不同类型的变量，需要使用对应的格式化字符串来输出`

## 6、实例化类   
```objective-c
    /*
        alloc - 为对象分配内存空间
        init - 进行初始化操作
    */
    People *p1 = [[People alloc] init];
    // 访问People里的属性className
    p1.className = "属性赋值"
    // 访问People里的成员变量_classInt
    p1->_classInt=1000
    // 调用People类的report方法
    [p1 report]
```    
## 7、h文件是类声明的文件；m文件是类实现的文件；成员变量定义在m文件里，属性定义在h文件里。

## 8、goto跳转到指定的代码块
```objective-c
int a = 1;
d:{
    a++;
}
if (a<5) {
    // 跳转到d
    goto d;
}
```    

## 9、\#import导入文件
```objective-c
    #import "MyClass.h"
```  

## 10、h文件定义的类，必须要在m文件里进行实现；否则无法被调用；如果只在m文件里实现了一个方法，则只能在这个类的内部调用，外部无法调用这个方法；m实现文件里可以直接使用成员变量；

## 11、函数名（方法名）去掉函数类型、去掉参数类型、去掉参数名，剩下的就是函数名
```objective-c
// 这个函数名是：showWithA: andB:
// （int）代表返回值；:代表有参数；(double)代表参数类型；a和b代表参数名
- (int)showWithA:(double)a andB:(double)b
```





