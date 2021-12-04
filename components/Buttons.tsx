import { CSSProperties } from "react";
import styles from "./Buttons.module.css";

interface ButtonProps {
  text?: string;
  disabled?: boolean;
  loading?: boolean;
  submit?: boolean;
  icon?: JSX.Element;
  backgroundColor?: string;
  color?: string;
  onClick: (e: React.MouseEvent) => void;
  children?: JSX.Element | JSX.Element[];
  style?: CSSProperties;
}

export const BigButton: React.FC<ButtonProps> = ({
  text,
  icon,
  disabled,
  loading,
  submit,
  onClick,
  style,
  children,
}) => {
  const hideButton = disabled != undefined ? (loading ? true : false) : false;
  const child = children != undefined ? children : text;
  return (
    <button
      className={styles.bigButton}
      style={style}
      onClick={onClick}
      disabled={hideButton}
      type={submit ? "submit" : "button"}
    >
      {icon && icon}
      {loading ? "..." : child}
    </button>
  );
};

export const NormalButton: React.FC<ButtonProps> = ({
  text,
  disabled,
  icon,
  loading,
  submit,
  onClick,
  style,
  children,
}) => {
  const hideButton = disabled != undefined ? (loading ? true : false) : false;
  const child = children != undefined ? children : text;
  return (
    <button
      className={styles.normalButton}
      onClick={onClick}
      style={style}
      disabled={hideButton}
      type={submit ? "submit" : "button"}
    >
      {icon && icon}
      {loading ? "..." : child}
    </button>
  );
};

export const SmallButton: React.FC<ButtonProps> = ({
  text,
  icon,
  disabled,
  loading,
  submit,
  onClick,
  color,
  backgroundColor,
  style,
  children,
}) => {
  const hideButton = disabled != undefined ? (loading ? true : false) : false;
  const child = children != undefined ? children : text;
  return (
    <button
      className={styles.smallButton}
      style={{ backgroundColor: backgroundColor && backgroundColor, color: color && color, ...style }}
      onClick={onClick}
      disabled={hideButton}
      type={submit ? "submit" : "button"}
    >
      {icon && icon}
      {loading ? "..." : child}
    </button>
  );
};

export const IconButton: React.FC<ButtonProps> = ({
  text,
  icon,
  disabled,
  loading,
  onClick,
  color,
  backgroundColor,
  style,
  children,
}) => {
  const hideButton = disabled != undefined ? (loading ? true : false) : false;
  const child = children != undefined ? children : text;
  return (
    <button
      className={styles.iconButton}
      style={{ backgroundColor: backgroundColor && backgroundColor, color: color && color, ...style }}
      onClick={onClick}
      disabled={hideButton}
      type="button"
    >
      {icon && icon}
      {loading ? "..." : child}
    </button>
  );
};
