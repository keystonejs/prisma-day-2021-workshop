import { LoggingAny } from '../wrap_any';

import colors from 'colors/safe';
import ErrorStackParser from 'error-stack-parser';
import { Maps, drop } from './func';

// Logging is one place where LoggingAny is needed! The intent was object dumping code, down to
// every leaf, in a hardened way. A testground for DRY logging in ts.
// Closures are good for logging, localising to particular files/functions/lines, and returning a continuation.

export const fix = <T>(x: T) => x;

//These are functions string => string
export const successCol = colors.green;
export const warningCol = colors.yellow;
export const errorCol = colors.red;

interface CleanError {
  name: string;
  message: string;
  stack: string;
}

export type LogEventRenderer = Maps<CleanError, string>;

export type ColFun = Maps<string, string>;

export const sep = ': ';

export const baseErrorMsg = '';
export const undefinedVariableMsg =
  baseErrorMsg + 'Attempted to log an undefined variable.' + sep;
export const nullVariableMsg =
  baseErrorMsg + 'Attempted to log a null variable.' + sep;
export const unknownLineAndFileMsg =
  baseErrorMsg + 'Unknown line and file' + sep;
export const cantOpenErrorMsg =
  baseErrorMsg + 'Cant access stack info from Error()' + sep;

export type LoggerFun = Maps<string, void>;
export const simpleLogger = (msg: string) => console.log(msg);
export const dateRenderer = (msg: string): string => {
  return Date() + sep + msg;
};

export const fileLineRenderer = (e: CleanError) => {
  const stackFrames = ErrorStackParser.parse(e);
  const elem = stackFrames[0];

  const scope =
    elem.functionName === undefined ? 'file scope' : elem.functionName;
  return dateRenderer(
    elem.fileName +
      sep +
      scope +
      sep +
      elem.lineNumber +
      sep +
      elem.columnNumber
  );
};

// eslint-disable-line no-unused-vars
export const abbreviatedRenderer = (e: CleanError): string => {
  return drop(e)('');
};

export const stackRenderer = (e: CleanError): string => {
  let str = '';

  ErrorStackParser.parse(e)?.map((elem: ErrorStackParser.StackFrame) => {
    const scope =
      elem.functionName === undefined ? 'file scope' : elem.functionName;

    str =
      str +
      '\n' +
      elem?.fileName +
      sep +
      scope +
      sep +
      elem?.lineNumber +
      sep +
      elem?.columnNumber;
  });
  return dateRenderer(str);
};

export const cleanStackRenderer = (cleanMessage: string) => (e: Error) => {
  if (!e.stack) {
    dateRenderer(errorCol(cantOpenErrorMsg) + cleanMessage);
  } else {
    const ce = e as CleanError;
    const info = stackRenderer(ce);
    dateRenderer(info + sep + cleanMessage);
  }
};

//export type MonadicType<T> = (maps: T) => MonadicType<T>
// This apparently simple operation, logging, has a fairly rich monadic structure.
// FIXME: TYPEME: return type. It seems to be a recursive union.
export const logContextInfoGen =
  <TretObj>(retObj: TretObj) =>
  (logger: LoggerFun) =>
  (col: ColFun) =>
  (msgRenderer: LogEventRenderer) =>
  (toBeLogged: LoggingAny): TretObj => {
    if (toBeLogged === undefined)
      return logContextInfoGen(retObj)(logger)(warningCol)(stackRenderer)(
        undefinedVariableMsg
      );

    if (toBeLogged === null)
      return logContextInfoGen(retObj)(logger)(warningCol)(stackRenderer)(
        nullVariableMsg
      );
    let cleanMessage: string;

    if (typeof toBeLogged === 'string') {
      cleanMessage = col(toBeLogged);
    } else {
      // Strip anything else down to its source code, so we know what is being sent to us.
      // and print it plain, nothing is worse than red source code ...
      cleanMessage = JSON.stringify(toBeLogged, null, 3);
    }
    const e = new Error();
    if (!e.stack) {
      logger(errorCol(cantOpenErrorMsg) + cleanMessage);
    } else {
      const ce = e as CleanError;
      const info = msgRenderer(ce);
      logger(info + sep + cleanMessage);
    }

    return retObj;
  };

const logContextInfo =
  <TretObj>(retObj: TretObj) =>
  (col: ColFun) =>
  (msgRenderer: LogEventRenderer) =>
  (a: LoggingAny): TretObj =>
    logContextInfoGen(retObj)(simpleLogger)(col)(msgRenderer)(a);

export class logclos {
  depth = -1;
  renderer = () => {
    this.depth = this.depth + 1;
    return this.depth ? abbreviatedRenderer : fileLineRenderer;
  };
  warning = (a: LoggingAny) =>
    logContextInfo(this)(warningCol)(this.renderer())(a);
  error = (a: LoggingAny) => logContextInfo(this)(errorCol)(this.renderer())(a);
  success = (a: LoggingAny) =>
    logContextInfo(this)(successCol)(this.renderer())(a);
  trace = (a: LoggingAny) =>
    logContextInfoGen(this)(simpleLogger)(fix)(stackRenderer)(a);
  info = (a: LoggingAny) =>
    logContextInfoGen(this)(simpleLogger)(fix)(this.renderer())(a);
  reportSecurityIncident = (a: LoggingAny) =>
    logContextInfo(this)(errorCol)(this.renderer())(a);
}

export class xlogclos {
  warning = (a: LoggingAny) => drop(a)(this);
  error = (a: LoggingAny) => drop(a)(this);
  success = (a: LoggingAny) => drop(a)(this);
  trace = (a: LoggingAny) => drop(a)(this);
  info = (a: LoggingAny) => drop(a)(this);
  reportSecurityIncident = (a: LoggingAny) => drop(a)(this);
}

export const log = () => new logclos();

// eslint-disable-line no-unused-vars
export const xlog = () => new xlogclos();
