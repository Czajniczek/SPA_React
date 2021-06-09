using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApi.Models
{
    public class Client
    {
        public int ClientId { get; set; }

        public string Name { get; set; }

        public string Surname { get; set; }

        public string Adress { get; set; }

        public string PhoneNumber { get; set; }

        public string Email { get; set; }

        public virtual ICollection<Order> Orders { get; set; }
    }
}
