// Thanks to
// https://medium.com/@vahid.vdn/implement-a-dependency-injection-container-from-scratch-7092c8a0ae7a

import "reflect-metadata";

type ClassType<T = any> = { new (...args: any[]): T };

function Injectable() {
  return function (target: any) {
    console.log("Injectable mark", target);
    Reflect.defineMetadata("injectable", true, target);
  };
}

class Container {
  dependencies: Record<string, any> = [];

  init(deps: any[]) {
    deps.map((target) => {
      const isInjectable = Reflect.getMetadata("injectable", target);
      if (!isInjectable) return;

      // get the typeof parameters of constructor
      const paramTypes = Reflect.getMetadata("design:paramtypes", target) || [];

      // resolve dependecies of current dependency
      const childrenDep = paramTypes.map((paramType: ClassType) => {
        // recursively resolve all child dependencies:
        this.init([paramType]);

        if (!this.dependencies[paramType.name]) {
          console.log("DI resolve", target, "paramTypes", paramTypes);
          this.dependencies[paramType.name] = new paramType();
          return this.dependencies[paramType.name];
        }
        return this.dependencies[paramType.name];
      });

      // resolve dependency by injection child classes that already resolved
      if (!this.dependencies[target.name]) {
        console.log("DI resolve", target, "paramTypes", paramTypes);
        this.dependencies[target.name] = new target(...childrenDep);
      }
    });

    return this;
  }

  public get<T extends ClassType>(serviceClass: T): InstanceType<T> {
    return this.dependencies[serviceClass.name];
  }
}

// -----------------------------------

@Injectable()
class ProductService {
  constructor() {}

  getProducts() {
    console.log("getting products..!! 🍊🍊🍊");
  }
}

@Injectable()
class OrderService {
  constructor(private productService: ProductService) {}

  getOrders() {
    console.log("getting orders..!! 📦📦📦");
    this.productService.getProducts();
  }
}

@Injectable()
class UserService {
  constructor(private orderService: OrderService) {}

  getUsers() {
    console.log("getUsers runs!");
    this.orderService.getOrders();
  }
}

// -----------------------------------
// Usage
// -----------------------------------

async function main() {
  const app = new Container().init([UserService, ProductService, OrderService]);
  const userService = app.get(UserService);

  userService.getUsers();
}
main();
