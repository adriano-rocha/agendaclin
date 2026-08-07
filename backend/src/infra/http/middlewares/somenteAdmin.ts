import { Request, Response, NextFunction } from "express";

export function somenteAdmin(req: Request, res: Response, next: NextFunction): void {
  if (req.usuario?.perfil !== "ADMIN") {
    res.status(403).json({ erro: "Acesso restrito a administradores" });
    return;
  }

  next();
}