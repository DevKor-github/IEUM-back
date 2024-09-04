type MethodChecker<T> = {
  [K in keyof T]: T[K] extends Function ? K : never;
};
//객체 T에 대해, T의 프로퍼티 키 K들에 대해서 해당 프로퍼티가 Function인지 체크
//Function이면 K를 반환하고, 아니면 never를 반환

export type MethodNames<T> = MethodChecker<T>[keyof T];
//MethodChecker에서 반환된 객체에 대해 모든 값을 유니온 타입으로 추출한다.
//never로 명시되어 함수가 아닌 프로퍼티는 추출하지 않는다
//결과적으로 클래스의 메서드 이름들을 추출하게 된다
