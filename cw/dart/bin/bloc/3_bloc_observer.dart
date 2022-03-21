// ignore: file_names
import 'package:bloc/bloc.dart';

abstract class CounterEvent {}

class CounterIncrementPressed extends CounterEvent {}

class CounterDecrementPressed extends CounterEvent {}

class CounterBloc extends Bloc<CounterEvent, int> {
  CounterBloc() : super(0) {
    on<CounterIncrementPressed>((event, emit) => emit(state + 1));
    on<CounterDecrementPressed>(((event, emit) => emit(state - 1)));
  }
}

class SimpleBlocObserver extends BlocObserver {
  @override
  void onEvent(Bloc bloc, Object? event) {
    super.onEvent(bloc, event);
    print('onEvent: ${bloc.runtimeType} $event');
  }

  @override
  void onChange(BlocBase bloc, Change change) {
    super.onChange(bloc, change);
    print('onChange: ${bloc.runtimeType} $change');
  }

  @override
  void onTransition(Bloc bloc, Transition transition) {
    super.onTransition(bloc, transition);
    print('onTransition: ${bloc.runtimeType} $transition');
  }
}

void main(List<String> args) async {
  BlocOverrides.runZoned(() async {
    final bloc = CounterBloc();
    final sub = bloc.stream.listen((element) {
      print(element);
    });

    bloc.add(CounterIncrementPressed());
    await Future.delayed(Duration(seconds: 1));
    bloc.add(CounterIncrementPressed());
    await Future.delayed(Duration(seconds: 1));
    bloc.add(CounterDecrementPressed());
    await Future.delayed(Duration(seconds: 1));

    await sub.cancel();
    await bloc.close();
  }, blocObserver: SimpleBlocObserver());
}
