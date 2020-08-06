import SwiftUI
import PlaygroundSupport

struct DragableCircle : View {
    @State var pos = CGSize.zero
    @State var isDraggable = false
    @State var translation = CGSize.zero
    var s = CGFloat(20.0)
    var color = Color.blue
    let minimumLongPressDuration = 0.5

    
    init(color: Color, size: CGFloat) {
        self.color = color
        s = size
    }
  
    var body: some View {
        // Long Tap Gesture
        let longTap = LongPressGesture(minimumDuration: minimumLongPressDuration).onEnded { value in
            self.isDraggable = true
        }
        
        // Drag Gesture
        let drag = DragGesture().onChanged { value in
            self.translation = value.translation
            self.isDraggable = true
        }.onEnded { value in
            self.pos.width += value.translation.width
            self.pos.height += value.translation.height
            self.translation = .zero
            self.isDraggable = false
        }
        
        return Circle()
        .fill(color)
        .frame(width: s, height: s, alignment: .center)
        .shadow(radius: self.isDraggable ? 8 : 0)
        .overlay(self.isDraggable ? Circle().stroke().stroke(Color.white, lineWidth: 2) : nil)
        .offset(x: pos.width + translation.width, y: pos.height + translation.height)
            .animation(.spring())
        .gesture(longTap.sequenced(before: drag))
        .zIndex(self.isDraggable ? 1 : 0)
    }
}

struct ContentView: View {
    var body: some View {
        VStack{
            DragableCircle(color: Color.blue, size: 50)
            DragableCircle(color: Color.red,size: 50)
        }
    }
}

PlaygroundPage.current.setLiveView(ContentView())
