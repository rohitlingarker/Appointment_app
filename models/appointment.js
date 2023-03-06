'use strict';
const {
  Model,
  Op
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Appointment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }

    static async getAppointments(){
      return await Appointment.findAll({
        order:[["date","ASC"],["startTime","ASC"]]
      })
    }

    static async newAppointment({eventName,description,date,startTime,endTime}){
      const appointments = await Appointment.findAll({
        where: {
          date:date,
          [Op.not]:[
            
              {
                [Op.or]:[
                  {
                    [Op.or]:[
                      {
                      endTime:{[Op.lte]:startTime}
                      },
                      {
                        [Op.and]:[
                          {
                            endTime:{[Op.gt]:startTime}
                          },
                          {
                            startTime:{[Op.gte]:endTime}
                          }
                        ]
                      }
                    ]
                  },
                  {
                    [Op.or]:[
                      {
                        startTime:{[Op.gte]:endTime}
                      },
                      {
                        [Op.and]:[
                          {
                            startTime:{[Op.lt]:endTime}
                          },
                          {
                            endTime:{[Op.lte]:startTime}
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        },
      );
      console.log(appointments);
      if(appointments.length){
        throw new Error(JSON.stringify(appointments))
      }
      if(startTime>endTime){
        return false
      }
      return await Appointment.create({
        eventName,
        description,
        date,
        startTime,
        endTime
      })
    }
  }
  Appointment.init({
    eventName: DataTypes.STRING,
    description: DataTypes.TEXT,
    date: DataTypes.DATEONLY,
    startTime: DataTypes.TIME,
    endTime: DataTypes.TIME
  }, {
    sequelize,
    modelName: 'Appointment',
  });
  return Appointment;
};