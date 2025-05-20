import { Asignatura } from "src/modules/asignatura/entities/asignatura.entity";
import { Entity, PrimaryColumn, Column, ManyToOne } from "typeorm";


@Entity()
export class SalaDeClases {
  @PrimaryColumn()
  sala: string; // Llave primaria

  @Column()
  disponibilidad: string;

  @Column({ default: false })
  laboratorio: boolean;

  @ManyToOne(() => Asignatura)
  nrcPrueba: Asignatura;

  @Column()
  capacidad: number;
}