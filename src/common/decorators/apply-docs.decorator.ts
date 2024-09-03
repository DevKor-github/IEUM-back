export function ApplyDocs(docs: Record<string, MethodDecorator[]>) {
  return function <T extends { new (...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
      constructor(...args: any[]) {
        super(...args);
        for (const methodName in docs) {
          const methodDescriptor = Object.getOwnPropertyDescriptor(
            constructor.prototype,
            methodName,
          ); //method의 descriptor가 담겼다.
          for (const decorator of docs[methodName]) {
            //해당 메서드의 네임에 매핑된 데코레이터들에 대해 반복한다.
            decorator(constructor.prototype, methodName, methodDescriptor);
          }
          Object.defineProperty(
            constructor.prototype,
            methodName,
            methodDescriptor,
          );
        }
      }
    };
  };
}
