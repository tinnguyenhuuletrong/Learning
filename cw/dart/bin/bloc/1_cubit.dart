// ignore: file_names
import 'package:bloc/bloc.dart';

class CounterCubit extends Cubit<int> {
  CounterCubit(int initialState) : super(initialState);

  void increment() => emit(state + 1);

  void throwError() =>
      addError(Exception('it is ok. Just a test!'), StackTrace.current);
}

class SimpleBlocObserver extends BlocObserver {
  @override
  void onChange(BlocBase bloc, Change change) {
    super.onChange(bloc, change);
    print('SimpleBlocObserver: from ${bloc.runtimeType} $change');
  }

  @override
  void onError(BlocBase bloc, Object error, StackTrace stackTrace) {
    print(
        'SimpleBlocObserver: error from ${bloc.runtimeType} $error $stackTrace');
    super.onError(bloc, error, stackTrace);
  }
}

void main(List<String> args) async {
  // await simpleUse();

  useBlocObserver();
}

void useBlocObserver() {
  BlocOverrides.runZoned(
    () {
      CounterCubit(0)
        ..increment()
        ..increment()
        ..increment()
        ..throwError()
        ..close();
    },
    blocObserver: SimpleBlocObserver(),
  );

  print("bye!");
}

Future<void> simpleUse() async {
  final cubit = CounterCubit(0);
  final subscription =
      cubit.stream.listen((val) => {print("sub callback $val")}); // 1
  print("before inc ${cubit.state}");
  cubit.increment();
  print("after inc ${cubit.state}");
  await Future.delayed(Duration(seconds: 1));
  await subscription.cancel();
  await cubit.close();
  print("bye!");
}
