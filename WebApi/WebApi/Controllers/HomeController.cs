using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("Home")]
    public class HomeController : ControllerBase //Dodanie bazy danych
    {
        public HomeController()
        {

        }

        [HttpGet]
        [Route("All")]
        public async Task<IActionResult> GetAllProducts()
        {
            List<string> list = new List<string>();
            list.Add("XD");
            list.Add("XD");
            list.Add("XD");
            list.Add("XD");
            list.Add("XD");
            list.Add("XD");
            list.Add("XD");

            return Ok(list);
        }

        [HttpPost]
        [Route("Add")]
        public async Task<IActionResult> AddProduct([FromBody] object przychodzaceDane)
        {
            List<object> list = new List<object>();

            return Ok(list);
        }

        [HttpGet]
        [Route("Get/{Id}")]
        public async Task<IActionResult> GetUser([FromRoute] int Id)
        {
            return Ok();
        }
    }
}
