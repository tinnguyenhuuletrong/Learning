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

  // Debugger helper
  @override
  void onTransition(Transition<CounterEvent, int> transition) {
    super.onTransition(transition);
    print(transition);
  }
}

void main(List<String> args) async {
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
}
