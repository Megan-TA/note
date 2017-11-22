 // 简单版本
 let event = {}
 event.list = []
 // 订阅者
 event.listener = (fn) => {
     event.list.push(fn)
 }
 // 发布者
 event.publish = () => {
     event.list.forEach((item) => {
         item()
     })
 }
 let click = () => {
     console.log('event: click')
 }
 let hover = () => {
     console.log('event: hover')
 }

 event.listener(click)
 event.listener(hover)
 event.publish()