import SwiftUI
import MapKit
import PlaygroundSupport

//Bind Native View Wrapper
// `centerCoordinate`: NativeView -> SwiftUI State
// `pinLocations`: SwiftUI State -> NativeView

struct MapView: UIViewRepresentable {
    @Binding var centerCoordinate: CLLocationCoordinate2D
    @Binding var pinLocations: [MKPointAnnotation]

    func makeUIView(context: Context) -> MKMapView {
        let mapView = MKMapView()
        mapView.delegate = context.coordinator
        return mapView
    }

    func updateUIView(_ view: MKMapView, context: Context) {
        if pinLocations.count != view.annotations.count {
            view.removeAnnotations(view.annotations)
            view.addAnnotations(pinLocations)
        }
    }

    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }
    
    //    Binding MapViewDelegate <-> SwiftUI state
    class Coordinator: NSObject, MKMapViewDelegate {
        var parent: MapView

        init(_ parent: MapView) {
            self.parent = parent
        }
        
        func mapViewDidChangeVisibleRegion(_ mapView: MKMapView) {
            parent.centerCoordinate = mapView.centerCoordinate
        }
    }
}

struct ContentView: View {
    @State var location = CLLocationCoordinate2D()
    @State private var pinLocations = [MKPointAnnotation]()
    
    func printLocation() -> String {
        return String(format: "%.6f,%.6f", location.latitude, location.longitude)
    }
    
    var body: some View {
        VStack{
            MapView(centerCoordinate: $location, pinLocations: $pinLocations)
            VStack{
                Text(printLocation())
                Button(action: {
                    let newLocation = MKPointAnnotation()
                    newLocation.coordinate = self.location
                    self.pinLocations.append(newLocation)
                }){
                    Text("Pin")
                }
                .padding()
                .background(Color.black.opacity(0.75))
                .foregroundColor(.white)
                .font(.title)
                .clipShape(Circle())
                .padding(.trailing)
            }.padding()
            
            
        }.padding()
    }
}



PlaygroundPage.current.setLiveView(ContentView())
