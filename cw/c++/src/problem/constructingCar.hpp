#include <cmath>
#include <cstdlib>
#include <iostream>
using namespace std;

class ICar
{
public:

    virtual void EngineStart() = 0;

    virtual void EngineStop() = 0;

    virtual void Refuel(double liters) = 0;

    virtual void RunningIdle() = 0;

protected:

    bool engineIsRunning = false;
};

class IEngine
{
public:

    virtual void Consume(double liters) = 0;

    virtual void Start() = 0;

    virtual void Stop() = 0;

protected:

    bool isRunning = false;
};

class IFuelTank
{
public:

    virtual void Consume(double liters) = 0;

    virtual void Refuel(double liters) = 0;

protected:

    double fillLevel = 0.0;

    bool isOnReserve = false;

    bool isComplete = false;
};

class IFuelTankDisplay
{
protected:

    double fillLevel = 0.0;

    bool isOnReserve = false;

    bool isComplete = false;
};

class Engine : public IEngine
{
public:
    void Consume(double liters){
        // Do nothing
    };
    
    bool getIsRunning() {
        return isRunning;
    }
    
    void Start(){
        isRunning = true;
    };
    
    void Stop(){
        isRunning = false;
    }
};

class FuelTank : public IFuelTank
{
public:
    FuelTank(double level = 20) {
        fillLevel = 0;
        Refuel(level);
    };
    
    void Consume(double liters)
    {
        this->fillLevel -= liters;
        isComplete = fillLevel >= 60;
        isOnReserve = fillLevel < 5;
    };
    
    void Refuel(double liters){
        fillLevel = min(liters + fillLevel, 60.0);
        
        isComplete = fillLevel >= 60;
        isOnReserve = fillLevel < 5;
    };
    
    double getFillLevel() { return fillLevel;};
    bool getIsOnReserve() { return isOnReserve;};
    double getIsComplete() { return isComplete;};
    
};

class FuelTankDisplay : public IFuelTankDisplay
{
public:
    
    void UpdateInfo(FuelTank * fuelTank) {
        this->fillLevel = fuelTank->getFillLevel();
        this->isComplete = fuelTank->getIsComplete();
        this->isOnReserve = fuelTank->getIsOnReserve();
    }
    
    double getFillLevel() {
        double nearest = round(fillLevel * 100) / 100;
        return nearest;
    }
    
    bool getIsOnReserve() {
        return isOnReserve;
    }
    
    bool getIsComplete() {
        return isComplete;
    }
};

class Car : public ICar
{
private:
    Engine* engine;
    FuelTank* fuelTank;
public:
    FuelTankDisplay* fuelTankDisplay;
public:
    Car(double fillLevel = 20) {
        engine = new Engine();
        fuelTank = new FuelTank(fillLevel);
        fuelTankDisplay = new FuelTankDisplay();
        fuelTankDisplay->UpdateInfo(fuelTank);
    }
    
    void EngineStart() {
        if(fuelTank->getFillLevel() < 0) return;
        
        engine->Start();
    }
    
    void EngineStop() {
        engine->Stop();
    }
    
    virtual void Refuel(double liters) {
        fuelTank->Refuel(liters);
        fuelTankDisplay->UpdateInfo(fuelTank);
    }
    
    void RunningIdle() {
        if(!engine->getIsRunning()) return;
        
        const double COST = 0.0003;
        fuelTank->Consume(COST);
        fuelTankDisplay->UpdateInfo(fuelTank);
        
        if(fuelTank->getFillLevel() < 0)
            engine->Stop();
    }
    
    bool getEngineIsRunning() {
        return engine->getIsRunning();
    }
};


void test() {
//    Car car;
//
//    cout << car.getEngineIsRunning() << endl;
//
//    car.EngineStart();
//
//    cout << car.getEngineIsRunning() << endl;
//
//    car.EngineStop();
//
//    cout << car.getEngineIsRunning() << endl;
    
    
    Car car(1);
    car.EngineStart();
    for(int i = 0; i < 3000; i++)
    {
        car.RunningIdle();
    }
    cout << car.fuelTankDisplay->getFillLevel() << endl;
    
//    Car car(60);
//    cout << car.fuelTankDisplay->getIsComplete() << endl;
    
//    Car car(4);
//    cout << car.fuelTankDisplay->getIsOnReserve() << endl;
    
//    Car car(5);
//    car.Refuel(40);
//    cout << car.fuelTankDisplay->getFillLevel() << endl;
}
